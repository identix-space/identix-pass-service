import {Module} from '@nestjs/common';

import {LoggingModule} from "@/libs/logging/logging.module";
import {IssuerService} from "@/libs/vc-brokerage/components/agent/services/issuer.service";
import {AgentService} from "@/libs/vc-brokerage/components/agent/services/holder.service";
import {VerifierService} from "@/libs/vc-brokerage/components/agent/services/verifier.service";

@Module({
    imports: [
        LoggingModule.forRoot({serviceName: 'Messaging module'})
    ],
    providers: [IssuerService, AgentService, VerifierService],
    exports: [IssuerService, AgentService, VerifierService]
})
export class AgentModule {}