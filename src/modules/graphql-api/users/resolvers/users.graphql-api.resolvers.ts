import {UseGuards} from "@nestjs/common";
import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {UsersEntity} from "@/libs/database/entities";
import {UsersGraphqlApiService} from '@/modules/graphql-api/users/services/users.graphql-api.service';
import {TUserCreate} from "@/modules/graphql-api/users/types";
import {SsoAuthGuard} from "@/modules/authentication/guards/sso-auth.guard";

@UseGuards(SsoAuthGuard)
@Resolver(of => UsersEntity)
export class UsersGraphqlApiResolvers {
  constructor(
    private usersService: UsersGraphqlApiService,
  ) {
  }

  @Mutation(returns => UsersEntity)
  async createUser(
    @Args('did', {type: () => String}) did: string
  ) {
    return this.usersService.create({ did } as TUserCreate);
  }

  @Query(returns => UsersEntity)
  async getUser(@Args('id', {type: () => Int}) id: number) {
    return this.usersService.findById(id);
  }

  @Mutation(returns => Boolean)
  async deleteUser(@Args('id', {type: () => Int}) id: number) {
    return this.usersService.deleteById(id);
  }
}