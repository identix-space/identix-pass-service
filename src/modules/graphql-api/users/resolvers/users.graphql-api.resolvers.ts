import { Inject, UseGuards } from "@nestjs/common";
import { SsoAuthGuard } from "@/modules/authentication/guards/sso-auth.guard";
import { Args, Context, GqlExecutionContext, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersGraphqlApiService } from '@/modules/graphql-api/users/services/users.graphql-api.service';
import { Did } from "@/libs/vc-brokerage/types";
import {
  AgentsSessionsRegistry,
  IAgentsSessionsRegistry
} from "@/libs/vc-brokerage/components/agents-sessions-registry/types";
import { Account } from "@/libs/sso-client/types";

@UseGuards(SsoAuthGuard)
@Resolver('Users')
export class UsersGraphqlApiResolvers {
  constructor(private usersService: UsersGraphqlApiService) {
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
  async logout(@Context('req') req: { user?: Account, token: Did }): Promise<boolean> {
    this.usersService.deleteAgentSession(req?.user.did);
    return this.usersService.ssoLogout(req.token);
  }

  @Mutation(returns => Boolean)
  async deleteAccount(@Context('req') req: { user?: Account, token: Did }): Promise<boolean> {
    return this.usersService.deleteAccount(req.token);
  }
}
