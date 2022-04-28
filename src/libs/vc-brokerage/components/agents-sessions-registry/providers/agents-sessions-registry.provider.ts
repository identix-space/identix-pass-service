import {ConfigService} from "@nestjs/config";
import {LoggingService} from "@/libs/logging/services/logging.service";
import {AgentsSessionsRegistry, IAgent, IAgentsSessionsRegistry} from "../types";
import {AgentService} from "@/libs/vc-brokerage/components/agents-sessions-registry/services/agent.service";
import {Did} from "@/libs/vc-brokerage/types";
import {IMessagingClient, MessagingClient} from "@/libs/messaging/types";
import {BrokersStrategies, IVcBrokersProvider, VcBrokers} from "@/libs/vc-brokerage/components/vc-brokers/types";
import {IVcSchemesClient, VcSchemesClient} from "@/libs/vc-brokerage/components/vc-schemes/types";
import {WalletsStorageClient, IWalletsStorageClient} from "@/libs/wallets-storage-client/types";

export const AgentsSessionsRegistryProvider = {
  provide: AgentsSessionsRegistry,
  useFactory: (config: ConfigService,
               logger: LoggingService,
               messagingClient: IMessagingClient,
               vcBrokersProvider: IVcBrokersProvider,
               vcSchemesClient: IVcSchemesClient,
               walletsStorageClient: IWalletsStorageClient
               ): Promise<IAgentsSessionsRegistry> =>
    agentsSessionsRegistryFactory(config, logger, messagingClient, vcBrokersProvider, vcSchemesClient, walletsStorageClient),
  inject: [
    ConfigService,
    LoggingService,
    MessagingClient,
    VcBrokers,
    VcSchemesClient,
    WalletsStorageClient
  ],
};

async function  agentsSessionsRegistryFactory(
  config: ConfigService,
  logger: LoggingService,
  messagingClient: IMessagingClient,
  vcBrokersProvider: IVcBrokersProvider,
  vcSchemesClient: IVcSchemesClient,
  walletsStorageClient: IWalletsStorageClient
): Promise<IAgentsSessionsRegistry> {
  const agentsSessionsStorage: Map<Did, AgentService> = new Map<Did, AgentService>();

  const clearExpiredSessions =  () => {};

  const vcBroker = vcBrokersProvider.getBroker(BrokersStrategies.simple);

  return {
    createAgentSession: (agentDid: Did): void  => {
      const agent = new AgentService(messagingClient, vcBroker, vcSchemesClient, walletsStorageClient);

      if (!agentsSessionsStorage.has(agentDid)) {
        agentsSessionsStorage.set(agentDid, agent);
      }
    },
    deleteAgentSession: (agentDid: Did): void =>  {
      if (!agentsSessionsStorage.has(agentDid)) {
        return;
      }

      agentsSessionsStorage.delete(agentDid);
    },
    getAgent: (agentDid: Did): AgentService =>  {
      if (!agentsSessionsStorage.has(agentDid)) {
        return;
      }

      return agentsSessionsStorage.get(agentDid)
    }
  }
}
