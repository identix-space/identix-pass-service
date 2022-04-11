import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {HmacSHA256} from 'crypto-js';
import {InjectRepository} from "@nestjs/typeorm";

import {PasswordsEntity, UsersEntity} from "@/libs/database/entities";
import {Repository} from "typeorm";
import {UsersStatusTypes} from "@/libs/database/types/users-status.types";
import {TokenType, AuthenticationUserData} from "../types";
import {bufferToHex} from "ethereumjs-util";
import {recoverPersonalSignature} from "eth-sig-util";

@Injectable()
export class AuthenticationService {
  private readonly blockchainSignupPhrasePrefix: string;
  private readonly hmacSHA256SecretKey: string;

  constructor(
    private jwtService: JwtService,
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(PasswordsEntity)
    private passwordsRepository: Repository<PasswordsEntity>
  ) {
    this.blockchainSignupPhrasePrefix = process.env.REACT_APP_BLOCKCHAIN_SIGNUP_PHRASE_PREFIX;
    this.hmacSHA256SecretKey = process.env.HMAC_SHA256_SECRET_KEY;
  }

  public async login(userData: AuthenticationUserData): Promise<TokenType> {
    const {username, password, accountAddress, signature} = userData;

    let user;
    if (username && password) {
      user = await this.findAndValidateUserByUsername(username, password);
    } else if (accountAddress && signature) {
       user = await this.findAndValidateUserByBlockchainAddress(accountAddress, signature);
    } else {
      throw new BadRequestException('At least one pair of parameters are required: {username, password} or {accountAddress, signature}')
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    user.lastActivity = new Date();
    await this.usersRepository.save(user);

    return this.tokenGenerator(user);
  }

  public async findAndValidateUserByUsername(username: string, pass: string): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne(
      {email: username},
      {relations: ["company"]}
    );

    if (!user || !(user instanceof UsersEntity) || user.status !== UsersStatusTypes.Active) return;

    const {passwordHash} = await this.passwordsRepository.findOne({user}) || {};

    if (!passwordHash) return;
    if (HmacSHA256(pass, this.hmacSHA256SecretKey).toString() !== passwordHash) return;

    return user;
  }

  private async findAndValidateUserByBlockchainAddress(accountAddress: string,
                                                       signature: string): Promise<UsersEntity> {
    if (!accountAddress || !signature) return;

    const user = await this.usersRepository.findOne({accountAddress});

    if (!user || !(user instanceof UsersEntity) || user.status !== UsersStatusTypes.Active) return;

    const {nonce} = user;
    const signUpPhrase = `${this.blockchainSignupPhrasePrefix} ${nonce} `;
    const signUpPhraseBufferHex = bufferToHex(Buffer.from(signUpPhrase, 'utf8'));
    const addressFromSignature = recoverPersonalSignature({
      data: signUpPhraseBufferHex,
      sig: signature,
    });

    if (addressFromSignature.toLowerCase() !== accountAddress.toLowerCase()) return;

    return user;
  }

  private async tokenGenerator(user: UsersEntity): Promise<TokenType> {
    const {id: userId, email, accountAddress} = user;
    const payload = {
      sub: userId,
      email,
      accountAddress,
      lastActivity: user.lastActivity
    };

    return { accessToken: this.jwtService.sign(payload), email, accountAddress };
  }
}
