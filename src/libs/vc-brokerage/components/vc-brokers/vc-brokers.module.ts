import {Module} from '@nestjs/common';

import {LoggingModule} from "@/libs/logging/logging.module";
import {SimpleBrokerService} from "@/libs/vc-brokerage/components/vc-brokers/services/simple-broker.service";
import {VcBrokersProvider} from "@/libs/vc-brokerage/components/vc-brokers/providers/vc-brokers.provider";

@Module({
    imports: [
        LoggingModule.forRoot({serviceName: 'VC Broker module'})
    ],
    providers: [VcBrokersProvider, SimpleBrokerService],
    exports: [VcBrokersProvider]
})
export class BrokersModule {}
