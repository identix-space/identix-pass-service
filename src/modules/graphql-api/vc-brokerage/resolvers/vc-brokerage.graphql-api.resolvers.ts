import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {VCBrokerageGraphqlApiService} from "@/modules/graphql-api/vc-brokerage/services/vc-brokerage.graphql-api.service";
import {UseGuards} from "@nestjs/common";
import {SsoAuthGuard} from "@/modules/authentication/guards/sso-auth.guard";
import {AgentsRoles, Did, VerificationStatuses} from "@/libs/vc-brokerage/types";
import {Message} from "@/libs/messaging/types";

@UseGuards(SsoAuthGuard)
@Resolver('VCBrokerage')
export class VcBrokerageGraphqlApiResolvers {
  constructor(
    private vcBrokerageGraphqlAPIService: VCBrokerageGraphqlApiService,
  ) {
  }

  @Mutation(returns => String)
  async issuerVC( @Args('vcData', {type: () => String}) vcData: string): Promise<Did>
  {
    return;
  }

  @Mutation(returns => Boolean)
  async requestVerificationVC(
    @Args('vcData', {type: () => String}) vcDid: Did,
    @Args('vcData', {type: () => String}) verifierDid: Did): Promise<void>
  {}

  @Mutation(returns => Boolean)
  async verifyVC(
    @Args('vcDid', {type: () => String}) vcDid: Did,
    @Args('verificationResult', {type: () => String}) verificationResult: VerificationStatuses): Promise<void>
  {}

  @Query(returns => [Message])
  async getMessages(page?: number, limit?: number): Promise<Message[]>
  {
    return [];
  }
}
