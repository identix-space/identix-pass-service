import { Inject, UseGuards } from "@nestjs/common";
import { SsoAuthGuard } from "@/modules/authentication/guards/sso-auth.guard";
import { Args, Context, GqlExecutionContext, Query, Resolver } from '@nestjs/graphql';
import { UsersGraphqlApiService } from '@/modules/graphql-api/users/services/users.graphql-api.service';
import { Did } from "@/libs/vc-brokerage/types";
import {
  AgentsSessionsRegistry,
  IAgentsSessionsRegistry
} from "@/libs/vc-brokerage/components/agents-sessions-registry/types";
import { Account } from "@/libs/sso-client/types";
import { SsoClientService } from "@/libs/sso-client/services/sso-client.service";

@UseGuards(SsoAuthGuard)
@Resolver('Users')
export class UsersGraphqlApiResolvers {
  constructor(private usersService: UsersGraphqlApiService, private ssoClient: SsoClientService) {
  }

  @Query(returns => [String])
  async getAllAccounts() {
    return this.usersService.getAllAccounts();
  }

  @Query(returns => Boolean)
  async checkAccountExists(
    @Args('did', { type: () => String }) did: Did
  ) {
    return this.usersService.checkAccountExists(did);
  }

  @Query(returns => Account)
  async whoami(@Context('req') req: { user?: Account }): Promise<Account> {
    return req?.user;
  }

  @Query(returns => Boolean)
  async logout(@Context('req') req: { user?: Account }): Promise<boolean> {
    this.usersService.deleteAgentSession(req?.user.did);
    return this.ssoClient.logout(req?.user.did);
  }
}
