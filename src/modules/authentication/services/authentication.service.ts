import {Inject, Injectable, BadRequestException, UnauthorizedException} from '@nestjs/common';

import {SSOClient, ISSOClient, Account} from "@/libs/sso-client/types"
import {Did} from "@/libs/vc-brokerage/types";
import {
  AgentsSessionsRegistry,
  IAgentsSessionsRegistry
} from "@/libs/vc-brokerage/components/agents-sessions-registry/types";

@Injectable()
export class AuthenticationService {
  constructor(
      @Inject(SSOClient) private ssoClient: ISSOClient,
      @Inject(AgentsSessionsRegistry) private agentsSessionsRegistry: IAgentsSessionsRegistry
    ) {}

  public async validateUserSession(userSessionDid: Did): Promise<Account> {
    const user = await this.ssoClient.validateUserSession(userSessionDid);

    await this.agentsSessionsRegistry.createAgentSession(user.did);

    return user;
  }
}
