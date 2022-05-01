import {Args, Context, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {VCBrokerageGraphqlApiService} from "@/modules/graphql-api/vc-brokerage/services/vc-brokerage.graphql-api.service";
import {UseGuards} from "@nestjs/common";
import {SsoAuthGuard} from "@/modules/authentication/guards/sso-auth.guard";
import {AgentsRoles, Did, EventLogEntry, VC, VerificationStatuses} from "@/libs/vc-brokerage/types";

@UseGuards(SsoAuthGuard)
@Resolver('VCBrokerage')
export class VcBrokerageGraphqlApiResolvers {
  constructor(
    private vcBrokerageGraphqlAPIService: VCBrokerageGraphqlApiService,
  ) {
  }

  @Mutation(returns => Boolean)
  async issuerVC(
    @Args('holderDid', {type: () => String}) holderDid: string,
    @Args('vcTypeDid', {type: () => String}) vcTypeDid: string,
    @Args('vcParams', {type: () => String}) vcParams: string
  ): Promise<boolean>
  {
    return this.vcBrokerageGraphqlAPIService.issuerVc(holderDid, vcTypeDid, vcParams);
  }

  @Query(returns => [VC])
  async getUserVCs(
    @Context('req') req: { userDid?: string },
    @Args('role', {type: () => AgentsRoles, nullable: true}) role?: AgentsRoles,
    @Args('startIndex', {type: () => Int, nullable: true}) startIndex?: number,
    @Args('count', {type: () => Int, nullable: true}) count?: number
  ) {
    return this.vcBrokerageGraphqlAPIService.getUserVCs(req?.userDid, role, startIndex, count);
  }

  @Query(returns => VC)
  async getVC(
    @Context('req') req: { userDid?: string },
    @Args('vcDid', {type: () => String}) vcDid: string
  ) {
    return this.vcBrokerageGraphqlAPIService.getVC(req?.userDid, vcDid);
  }

  @Mutation(returns => Boolean)
  async requestVcVerification(
    @Args('verifierDid', {type: () => String}) verifierDid: Did,
    @Args('vcDid', {type: () => String}) vcDid: Did): Promise<boolean>
  {
    return true;
  }

  @Mutation(returns => Boolean)
  async verifyVC(
    @Args('vcDid', {type: () => String}) vcDid: Did,
    @Args('verificationStatus',
      {type: () => VerificationStatuses}) verificationStatus: VerificationStatuses): Promise<boolean>
  {
    return true;
  }

  @Query(returns => [EventLogEntry])
  async getEventLogEntries(
    @Args('startIndex', {type: () => Int, nullable: true}) startIndex?: number,
    @Args('count', {type: () => Int, nullable: true}) count?: number
  ): Promise<EventLogEntry[]>
  {
    return [];
  }
}
