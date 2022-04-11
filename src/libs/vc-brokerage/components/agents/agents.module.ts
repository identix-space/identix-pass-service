import {Module} from '@nestjs/common';

import {LoggingModule} from "@/libs/logging/logging.module";
import {IssuerService} from "@/libs/vc-brokerage/components/agents/services/issuer.service";
import {HolderService} from "@/libs/vc-brokerage/components/agents/services/holder.service";
import {VerifierService} from "@/libs/vc-brokerage/components/agents/services/verifier.service";

@Module({
    imports: [
        LoggingModule.forRoot({serviceName: 'Messaging module'})
    ],
    providers: [IssuerService, HolderService, VerifierService],
    exports: [IssuerService, HolderService, VerifierService]
})
export class AgentsModule {}