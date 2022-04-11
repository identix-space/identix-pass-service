import {Strategy} from 'passport-local';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthenticationService} from "../services/authentication.service";
import {UsersEntity} from "@/libs/database/entities";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthenticationService) {
    super();
  }

  async validate(username: string, password: string): Promise<UsersEntity> {
    const user = await this.authService.findAndValidateUserByUsername(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}