import {Module} from '@nestjs/common';

import {LoggingModule} from "@/libs/logging/logging.module";

@Module({
  imports: [
    LoggingModule.forRoot({serviceName: 'Authentication module'})
  ],
  providers: [],
  exports: []
})
export class AuthenticationModule {}
