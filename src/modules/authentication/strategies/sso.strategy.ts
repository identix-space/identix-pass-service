import {Strategy} from 'passport-local';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthenticationService} from "../services/authentication.service";
import {Did} from "@/libs/vc-brokerage/types";

@Injectable()
export class SsoStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthenticationService) {
    super();
  }

  async validate(userSessionDid: Did): Promise<Did> {
    const userDid = await this.authService.validateUserSession(userSessionDid);
    if (!userDid) {
      throw new UnauthorizedException();
    }
    return userDid;
  }
}