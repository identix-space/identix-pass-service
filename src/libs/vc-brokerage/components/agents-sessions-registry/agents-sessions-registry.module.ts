import {Module} from '@nestjs/common';

import {LoggingModule} from "@/libs/logging/logging.module";
import {AgentsSessionsRegistryProvider} from "@/libs/vc-brokerage/components/agents-sessions-registry/providers/agents-sessions-registry.provider";
import {BrokersModule} from "@/libs/vc-brokerage/components/vc-brokers/vc-brokers.module";
import {VcSchemesModule} from "@/libs/vc-brokerage/components/vc-schemes/vc-schemes.module";

@Module({
    imports: [
        LoggingModule.forRoot({serviceName: 'Messaging module'}),
        BrokersModule,
        VcSchemesModule
    ],
    providers: [AgentsSessionsRegistryProvider],
    exports: [AgentsSessionsRegistryProvider]
})
export class AgentsSessionsRegistryModule {}
