import {IVCStorageClient, VCStorageClientProvider} from "@/libs/vc-brokerage/components/vault/types";
import {ConfigService} from "@nestjs/config";
import {LoggingService} from "@/libs/logging/services/logging.service";
import {CustodialLocalWalletClient} from "@/libs/vc-brokerage/components/vault/clients/custodial-local-wallet.client";
import {VcStorageService} from "@/libs/vc-brokerage/components/vault/services/vc-storage.service";

export const AgentsSessionsRegistryProvider = {
  provide: VCStorageClientProvider,
  useFactory: (config: ConfigService,
               logger: LoggingService): IAgentsSessionsRegystry =>
    vcStorageClientFactory(config, logger, custodialLocalWalletClient),
  inject: [
    ConfigService,
    LoggingService,
    CustodialLocalWalletClient,
    VcStorageService
  ],
};