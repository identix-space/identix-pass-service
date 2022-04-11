import { ConfigService } from '@nestjs/config';

import {
  VCStorageClientProvider,
  VCStorageConfigurationType,
  IVCStorageClient,
  WalletsKinds,
  IWalletClient
} from "../types";
import {LoggingService} from "@/libs/logging/services/logging.service";
import {CustodialLocalWalletClient} from "@/libs/vc-brokerage/components/vc-storage/clients/custodial-local-wallet.client";
import {VCData} from "@/libs/vc-brokerage/types";
import {VcStorageService} from "@/libs/vc-brokerage/components/vc-storage/services/vc-storage.service";

export const VCStorageProvider = {
  provide: VCStorageClientProvider,
  useFactory: (config: ConfigService,
               logger: LoggingService,
               custodialLocalWalletClient: CustodialLocalWalletClient): IVCStorageClient =>
    vcStorageClientFactory(config, logger, custodialLocalWalletClient),
  inject: [
    ConfigService,
    LoggingService,
    CustodialLocalWalletClient,
    VcStorageService
  ],
};

function vcStorageClientFactory(
  config: ConfigService,
  logger: LoggingService,
  custodialLocalWalletClient: CustodialLocalWalletClient
): IVCStorageClient {
  const vcStorageConfig = config.get<VCStorageConfigurationType>('vc-storage-configuration');
  if (!vcStorageConfig) {
    throw new Error(`VC storage configuration is invalid!`);
  }

  const getWalletClient = (walletKind: WalletsKinds): IWalletClient => {
    switch (walletKind) {
      case WalletsKinds.CustodialLocalWallet:
        return custodialLocalWalletClient;
      default:
        throw new Error(`Unknown wallet kind: ${walletKind}`);
    }
  };

  return {
    createVC: async (walletKind: WalletsKinds, did: string, vcData: VCData): Promise<string> => {
      const walletClient = getWalletClient(walletKind);
      const vcStorageService = new VcStorageService(walletClient);

      return vcStorageService.createVC(did, vcData);
    },
    readVC: async (walletKind: WalletsKinds, did: string): Promise<VCData> => {
      const walletClient = getWalletClient(walletKind);
      const vcStorageService = new VcStorageService(walletClient);

      return vcStorageService.readVC(did);
    },
    updateVC: async (walletKind: WalletsKinds, did: string, vcData: VCData): Promise<void> => {
      const walletClient = getWalletClient(walletKind);
      const vcStorageService = new VcStorageService(walletClient);

      return vcStorageService.updateVC(did, vcData);
    },
    deleteVC: async (walletKind: WalletsKinds, did: string): Promise<void> => {
      const walletClient = getWalletClient(walletKind);
      const vcStorageService = new VcStorageService(walletClient);

      return vcStorageService.deleteVC(did);
    }
  }
}