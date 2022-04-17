import {IVCStorageClient, VCStorageClientProvider} from "@/libs/vc-brokerage/components/vault/types";
import {ConfigService} from "@nestjs/config";
import {LoggingService} from "@/libs/logging/services/logging.service";
import {CustodialLocalWalletClient} from "@/libs/vc-brokerage/components/vault/clients/custodial-local-wallet.client";
import {VcStorageService} from "@/libs/vc-brokerage/components/vault/services/vc-storage.service";
import {IAgentsSessionsRegistry} from "../types";

export const AgentsSessionsRegistryProvider = {
  provide: VCStorageClientProvider,
  useFactory: (config: ConfigService,
               logger: LoggingService,
               custodialLocalWalletClient: any
               ): Promise<IAgentsSessionsRegistry> =>
    vcStorageClientFactory(config, logger, custodialLocalWalletClient),
  inject: [
    ConfigService,
    LoggingService,
    CustodialLocalWalletClient,
    VcStorageService
  ],
};

async function  vcStorageClientFactory(
  config: ConfigService,
  logger: LoggingService,
  custodialLocalWalletClient: any
): Promise<IAgentsSessionsRegistry> {
  return;
}