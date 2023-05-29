import {ConfigService} from "@nestjs/config";
import {LoggingService} from "@/libs/logging/services/logging.service";
import {BrokersStrategies, IVcBroker, IVcBrokersProvider, VcBrokers} from '../types';
import {SimpleBrokerService} from "@/libs/vc-brokerage/components/vc-brokers/services/simple-broker.service";
import {IMessagingClient, MessagingClient} from "@/libs/messaging/types";
import {IWalletsStorageClient, WalletsStorageClient} from "@/libs/wallets-storage-client/types";
import {IVcSchemesClient, VcSchemesClient} from "@/libs/vc-brokerage/components/vc-schemes/types";

export const VcBrokersProvider = {
  provide: VcBrokers,
  useFactory: (config: ConfigService,
               logger: LoggingService,
               messagingClient: IMessagingClient,
               walletsStorageClient: IWalletsStorageClient,
               vcSchemesClient: IVcSchemesClient
               ): Promise<IVcBrokersProvider> =>
    vcBrokersProviderFactory(config, logger, messagingClient, walletsStorageClient, vcSchemesClient),
  inject: [
    ConfigService,
    LoggingService,
    MessagingClient,
    WalletsStorageClient,
    VcSchemesClient
  ],
};

async function  vcBrokersProviderFactory(
  config: ConfigService,
  logger: LoggingService,
  messagingClient: IMessagingClient,
  walletsStorageClient: IWalletsStorageClient,
  vcSchemesClient: IVcSchemesClient
): Promise<IVcBrokersProvider> {
  const simpleBroker = new SimpleBrokerService(messagingClient, walletsStorageClient);

  return {
    getBroker: (brokerStrategy: BrokersStrategies): IVcBroker => {
      return simpleBroker;
    }
  }
}
