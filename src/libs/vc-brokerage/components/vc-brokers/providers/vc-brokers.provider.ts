import {ConfigService} from "@nestjs/config";
import {LoggingService} from "@/libs/logging/services/logging.service";
import {BrokersStrategies, IVcBroker, IVcBrokersProvider, VcBrokers} from '../types';
import {SimpleBrokerService} from "@/libs/vc-brokerage/components/vc-brokers/services/simple-broker.service";
import {IMessagingClient, MessagingClient} from "@/libs/messaging/types";

export const VcBrokersProvider = {
  provide: VcBrokers,
  useFactory: (config: ConfigService,
               logger: LoggingService,
               messagingClient: IMessagingClient
               ): Promise<IVcBrokersProvider> => vcBrokersProviderFactory(config, logger, messagingClient),
  inject: [
    ConfigService,
    LoggingService,
    MessagingClient
  ],
};

async function  vcBrokersProviderFactory(
  config: ConfigService,
  logger: LoggingService,
  messagingClient: IMessagingClient
): Promise<IVcBrokersProvider> {
  const simpleBroker = new SimpleBrokerService(messagingClient);

  return {
    getBroker: (brokerStrategy: BrokersStrategies): IVcBroker => {
      return simpleBroker;
    }
  }
}
