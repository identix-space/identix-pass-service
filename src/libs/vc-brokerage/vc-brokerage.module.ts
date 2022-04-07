import {Module} from '@nestjs/common';

import {LoggingModule} from "@/libs/logging/logging.module";

@Module({
  imports: [
    LoggingModule.forRoot({serviceName: 'VC Brokerage module'})
  ],
  providers: [],
  exports: []
})
export class VcBrokerageModule {}