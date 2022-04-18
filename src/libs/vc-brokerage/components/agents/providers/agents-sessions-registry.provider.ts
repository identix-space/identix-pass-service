import {VCStorageClientProvider} from "@/libs/vc-brokerage/components/vault/types";
import {ConfigService} from "@nestjs/config";
import {LoggingService} from "@/libs/logging/services/logging.service";
import {IAgent, IAgentsSessionsRegistry} from "../types";
import {AgentService} from "@/libs/vc-brokerage/components/agents/services/agent.service";
import {Did} from "@/libs/vc-brokerage/types";

export const AgentsSessionsRegistryProvider = {
  provide: VCStorageClientProvider,
  useFactory: (config: ConfigService,
               logger: LoggingService
               ): Promise<IAgentsSessionsRegistry> =>
    agentsSessionsRegistryFactory(config, logger),
  inject: [
    ConfigService,
    LoggingService
  ],
};

async function  agentsSessionsRegistryFactory(
  config: ConfigService,
  logger: LoggingService
): Promise<IAgentsSessionsRegistry> {
  const agentsSessionsStorage: Map<Did, AgentService> = new Map<Did, AgentService>();

  const clearExpiredSessions =  () => {};

  return {
    createAgentSession: (userDid: Did): void  => {
      const agent = new AgentService();
    },
    deleteAgentSession: (userDid: Did): void =>  {

    },
    getAgent: (userDid: Did): IAgent =>  {
      return;
    }
  }
}