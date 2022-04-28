import {UseGuards} from "@nestjs/common";
import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {UsersGraphqlApiService} from '@/modules/graphql-api/users/services/users.graphql-api.service';
import {SsoAuthGuard} from "@/modules/authentication/guards/sso-auth.guard";
import {AgentsRoles, VC, Did} from "@/libs/vc-brokerage/types";

@UseGuards(SsoAuthGuard)
@Resolver('Users')
export class UsersGraphqlApiResolvers {
  constructor(
    private usersService: UsersGraphqlApiService,
  ) {
  }

  @Query(returns => [VC])
  async getUserVCs(
    @Args('role', {type: () => String}) role?: AgentsRoles,
    @Args('page', {type: () => Int}) page?: number,
    @Args('limit', {type: () => Int}) limit?: number
  ) {
    return this.usersService.getUserVCs(role, page, limit);
  }

  @Query(returns => Boolean)
  async checkAccountExists(
    @Args('did', {type: () => String}) did: Did
  ) {
    return this.usersService.checkAccountExists(did);
  }
}
