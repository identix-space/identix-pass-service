import {Module} from '@nestjs/common';

import {LoggingModule} from "@/libs/logging/logging.module";
import {MessagingService} from "@/libs/vc-brokerage/components/messaging/services/messaging.service";

@Module({
  imports: [
    LoggingModule.forRoot({serviceName: 'Messaging module'})
  ],
  providers: [MessagingService],
  exports: [MessagingService]
})
export class MessagingModule {}