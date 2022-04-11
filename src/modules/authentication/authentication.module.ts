import {PassportModule} from '@nestjs/passport';
import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {TypeOrmModule} from "@nestjs/typeorm";

import {PasswordsEntity, UsersEntity} from "@/libs/database/entities";
import {AuthenticationService} from './services/authentication.service';
import {LocalStrategy, JwtStrategy} from './strategies';
import {jwtConstants} from './constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, PasswordsEntity]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '12h'},
    }),
  ],
  providers: [AuthenticationHandler, AuthenticationService, LocalStrategy, JwtStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {
}
