import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from "@nestjs/typeorm";
import {JwtService} from "@nestjs/jwt";
import {Repository} from "typeorm";

import * as bcrypt from 'bcrypt'
import {HmacSHA256} from 'crypto-js';

import {AuthenticationService} from './authentication.service';
import {PasswordsEntity, UsersEntity} from "@/libs/database/entities";
import {UsersStatusTypes} from "@/libs/database/types/users-status.types";

jest.mock('bcrypt');

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  const usersRepositoryToken = getRepositoryToken(UsersEntity);
  const passwordsRepositoryToken = getRepositoryToken(PasswordsEntity);
  let usersRepositoryMock: Repository<UsersEntity>;
  let passwordsRepositoryMock: Repository<PasswordsEntity>;

  beforeEach(async () => {
    process.env.CRYPTO_JS_CHECK_DATETIME_FROM = "2021-10-12 00:00:00";
    process.env.HMAC_SHA256_SECRET_KEY = 'secret-key';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: JwtService,
          useValue: {}
        },
        {
          provide: usersRepositoryToken,
          useValue: {
            findOne: () => []
          }
        },
        {
          provide: passwordsRepositoryToken,
          useValue: {
            findOne: () => []
          }
        }
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    usersRepositoryMock = module.get(usersRepositoryToken);
    passwordsRepositoryMock = module.get(passwordsRepositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('check findAndValidateUser()', () => {
    describe('check user & passwordhash exist', () => {
      it('user does not exist', async () => {
        jest.spyOn(usersRepositoryMock, 'findOne')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(undefined);
          }));

        const result = await service.findAndValidateUser('username', 'password');

        expect(result).toBeUndefined();
      });

      it('user exists but status is not Active', async () => {
        jest.spyOn(usersRepositoryMock, 'findOne')
          .mockImplementation(() => new Promise((resolve) => {
            const user = new UsersEntity();
            user.status = UsersStatusTypes.Blocked;
            resolve(user);
          }));

        const result = await service.findAndValidateUser('username', 'password');

        expect(result).toBeUndefined();
      });

      it('passwordHash does not exist', async () => {
        jest.spyOn(usersRepositoryMock, 'findOne')
          .mockImplementation(() => new Promise((resolve) => {
            const user = new UsersEntity();
            user.status = UsersStatusTypes.Active;
            resolve(user);
          }));

        jest.spyOn(passwordsRepositoryMock, 'findOne')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(undefined);
          }));

        const result = await service.findAndValidateUser('username', 'password');

        expect(result).toBeUndefined();
      });
    });

    describe('passwordUpdatedAt < cryptoJSCheckDatetimeFrom => check bcrypt.compare', () => {
      let user;
      let password;

      beforeAll(() => {
        user = new UsersEntity();
        user.status = UsersStatusTypes.Active;

        password = new PasswordsEntity();
        password.passwordHash = 'password';
        password.updatedAt = new Date('2021-09-01 00:00:00');
      });

      it('valid pass', async () => {
        jest.spyOn(usersRepositoryMock, 'findOne')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(user);
          }));

        jest.spyOn(passwordsRepositoryMock, 'findOne')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(password);
          }));

        jest.spyOn(bcrypt, 'compare')
          .mockReturnValueOnce(new Promise((resolve) => {
            resolve(true)
          }));

        const result = await service.findAndValidateUser('username', 'password');

        expect(result).toMatchObject(user);
      });

      it('invalid pass', async () => {
        jest.spyOn(usersRepositoryMock, 'findOne')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(user);
          }));

        jest.spyOn(passwordsRepositoryMock, 'findOne')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(password);
          }));

        jest.spyOn(bcrypt, 'compare')
          .mockReturnValueOnce(new Promise((resolve) => {
            resolve(false)
          }));

        const result = await service.findAndValidateUser('username', 'password');

        expect(result).toBeUndefined();
      });
    });

    describe('passwordUpdatedAt >= cryptoJSCheckDatetimeFrom => check hmacSHA256', () => {
      let user;
      let password;

      beforeAll(() => {
        user = new UsersEntity();
        user.status = UsersStatusTypes.Active;

        password = new PasswordsEntity();
        password.passwordHash =
          HmacSHA256('password', process.env.HMAC_SHA256_SECRET_KEY).toString();
        password.updatedAt = new Date('2021-11-01 00:00:00');
      });

      it('valid pass', async () => {
        jest.spyOn(usersRepositoryMock, 'findOne')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(user);
          }));

        jest.spyOn(passwordsRepositoryMock, 'findOne')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(password);
          }));

        const result = await service.findAndValidateUser('username', 'password');

        expect(result).toMatchObject(user);
      });

      it('invalid pass', async () => {
        jest.spyOn(usersRepositoryMock, 'findOne')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(user);
          }));

        jest.spyOn(passwordsRepositoryMock, 'findOne')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(password);
          }));

        const result = await service.findAndValidateUser('username', 'wrong-password');

        expect(result).toBeUndefined();
      });
    });
  });
});
