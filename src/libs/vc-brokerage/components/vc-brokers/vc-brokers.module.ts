import {Module} from '@nestjs/common';

import {LoggingModule} from "@/libs/logging/logging.module";
import {BrokerService} from "@/libs/vc-brokerage/components/vc-brokers/services/broker.service";

@Module({
    imports: [
        LoggingModule.forRoot({serviceName: 'Messaging module'})
    ],
    providers: [BrokerService],
    exports: [BrokerService]
})
export class BrokersModule {}