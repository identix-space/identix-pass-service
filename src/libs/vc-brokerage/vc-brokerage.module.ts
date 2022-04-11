import {Module} from '@nestjs/common';

import {LoggingModule} from "@/libs/logging/logging.module";
import {VcBrokerageService} from "@/libs/vc-brokerage/services/vc-brokerage.service";

@Module({
  imports: [
    LoggingModule.forRoot({serviceName: 'VC Brokerage module'})
  ],
  providers: [VcBrokerageService],
  exports: []
})
export class VcBrokerageModule {}