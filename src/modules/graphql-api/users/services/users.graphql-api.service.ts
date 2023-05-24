import { Inject, Injectable } from "@nestjs/common";
import { Did } from "@/libs/vc-brokerage/types";
import {
  AgentsSessionsRegistry,
  IAgentsSessionsRegistry
} from "@/libs/vc-brokerage/components/agents-sessions-registry/types";
import { ISSOClient, SSOClient } from "@/libs/sso-client/types";

@Injectable()
export class UsersGraphqlApiService {
  constructor(
    @Inject(AgentsSessionsRegistry) private agentsSessionsRegistry: IAgentsSessionsRegistry,
    @Inject(SSOClient) private ssoClient: ISSOClient
  ) { }

  async checkAccountExists(did: Did): Promise<boolean> {
    return !!this.agentsSessionsRegistry.getAgent(did);
  }

  async getAllAccounts(): Promise<Did[]> {
    return this.agentsSessionsRegistry.getAllAgentsSessionsDids();
  }

  async ssoLogout(did: Did): Promise<boolean> {
    return this.ssoClient.logout(did);
  }

  async deleteAgentSession(did: Did): Promise<void> {
    return this.agentsSessionsRegistry.deleteAgentSession(did);
  }

}
