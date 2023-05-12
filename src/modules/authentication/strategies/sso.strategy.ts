import {Strategy} from 'passport-custom';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthenticationService} from "../services/authentication.service";
import {Did} from "@/libs/vc-brokerage/types";
import {Headers} from "@/modules/authentication/types";
import {Request} from 'express';
import { Account } from '@/libs/sso-client/types';

interface ExtendedRequest extends Request {
  userDid: Did;
}
@Injectable()
export class SsoStrategy extends PassportStrategy(Strategy, 'sso') {
  private readonly authorizationTokenHeaderName: string;

  constructor(private authService: AuthenticationService) {
    super();
    this.authorizationTokenHeaderName = process.env.AUTHORIZATION_TOKEN_HEADER_NAME || "authorization";
  }

  async validate(request: ExtendedRequest): Promise<Account> {
    const headers = this.getHeaders(request);

    if (!headers || !headers[this.authorizationTokenHeaderName]) {
      throw new UnauthorizedException();
    }

    const userSessionDid = String(headers[this.authorizationTokenHeaderName]);
    const user = await this.authService.validateUserSession(userSessionDid);

    if (!user) {
      throw new UnauthorizedException();
    }

    console.log(user);
    request.userDid = `${user.id}`;

    return user;
  }

  getHeaders(request: Request): Headers {
    if ( !request.rawHeaders || !Array.isArray(request.rawHeaders) || request.rawHeaders.length === 0) {
      return {};
    }

    return request.rawHeaders.reduce((result, current, index) => {
      if (index % 2 === 0) {
        result[request.rawHeaders[index]] = request.rawHeaders[index + 1];
        return result;
      }
      return result;
    }, {});
  }
}
