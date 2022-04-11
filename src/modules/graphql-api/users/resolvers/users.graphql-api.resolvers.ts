import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {UsersEntity} from "@/libs/database/entities";
import {UsersGraphqlApiService} from '@/modules/graphql-api/users/services/users.graphql-api.service';
import {TUserCreate, TUserUpdate} from "@/modules/graphql-api/users/types";

@Resolver(of => UsersEntity)
export class UsersGraphqlApiResolvers {
  constructor(
    private usersService: UsersGraphqlApiService,
  ) {
  }

  @Mutation(returns => UsersEntity)
  async createUser(
    @Args('email', {type: () => String}) email: string,
    @Args('address', {type: () => String}) address: string = '',
    @Args('nonce', {type: () => String}) nonce: string = '',
    @Args('lastActive', {type: () => String}) lastActive: string = null,
  ) {
    return this.usersService.create({
      email,
      address,
      nonce,
      lastActive: lastActive ? new Date(lastActive) : new Date()
    } as TUserCreate);
  }

  @Query(returns => UsersEntity)
  async getUser(@Args('id', {type: () => Int}) id: number) {
    return this.usersService.findById(id);
  }

  @Mutation(returns => UsersEntity)
  async updateUser(
    @Args('id', {type: () => Int}) id: number,
    @Args('email', {type: () => String}) email: string,
    @Args('address', {type: () => String}) address: string = '',
    @Args('nonce', {type: () => String}) nonce: string = '',
    @Args('lastActive', {type: () => String}) lastActive: string = null,
  ) {
    return this.usersService.updateById(id, {
      email,
      address,
      nonce,
      lastActive: lastActive ? new Date(lastActive) : new Date()
    } as TUserUpdate);
  }

  @Mutation(returns => Boolean)
  async deleteUser(@Args('id', {type: () => Int}) id: number) {
    return this.usersService.deleteById(id);
  }
}