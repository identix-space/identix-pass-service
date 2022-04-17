import {PassportModule} from '@nestjs/passport';
import {Module} from '@nestjs/common';

import {AuthenticationService} from './services/authentication.service';
import {SsoStrategy} from './strategies';
import {SsoClientModule} from "@/libs/sso-client/sso-client.module";

@Module({
  imports: [PassportModule, SsoClientModule],
  providers: [AuthenticationService, SsoStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {
}
