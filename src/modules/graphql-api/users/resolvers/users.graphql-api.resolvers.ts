import {UseGuards} from "@nestjs/common";
import {SsoAuthGuard} from "@/modules/authentication/guards/sso-auth.guard";
import {Args, Query, Resolver} from '@nestjs/graphql';
import {UsersGraphqlApiService} from '@/modules/graphql-api/users/services/users.graphql-api.service';
import {Did} from "@/libs/vc-brokerage/types";

//@UseGuards(SsoAuthGuard)
@Resolver('Users')
export class UsersGraphqlApiResolvers {
  constructor(
    private usersService: UsersGraphqlApiService,
  ) {
  }

  @Query(returns => Boolean)
  async checkAccountExists(
    @Args('did', {type: () => String}) did: Did
  ) {
    return this.usersService.checkAccountExists(did);
  }
}
