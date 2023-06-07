import {Args, Context, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {VCBrokerageGraphqlApiService} from "@/modules/graphql-api/vc-brokerage/services/vc-brokerage.graphql-api.service";
import {UseGuards} from "@nestjs/common";
import {SsoAuthGuard} from "@/modules/authentication/guards/sso-auth.guard";
import {AgentsRoles, Did, EventLogEntry, VC, VerificationStatuses} from "@/libs/vc-brokerage/types";
import {VcTypeInfo} from "../types";
import { Account } from '@/libs/sso-client/types';

@UseGuards(SsoAuthGuard)
@Resolver('VCBrokerage')
export class VcBrokerageGraphqlApiResolvers {
  constructor(
    private vcBrokerageGraphqlAPIService: VCBrokerageGraphqlApiService,
  ) {}

  @Query(returns => [VcTypeInfo])
  async getVcTypes(@Context('req') req: { user?: Account }) {
    return this.vcBrokerageGraphqlAPIService.getVcTypes(req?.user.did);
  }

  @Mutation(returns => Boolean)
  async issueVC(
    @Context('req') req: { userDid?: string },
    @Args('holderDid', {type: () => String}) holderDid: string,
    @Args('vcTypeDid', {type: () => String}) vcTypeDid: string,
    @Args('vcParams', {type: () => String}) vcParams: string
  ): Promise<boolean>
  {
    return this.vcBrokerageGraphqlAPIService.issueVC(req?.userDid, holderDid, vcTypeDid, vcParams);
  }

  @Query(returns => [VC])
  async getUserVCs(
    @Context('req') req: { userDid?: string },
    @Args('vcType', {type: () => String, nullable: true}) vcType?: string,
    @Args('role', {type: () => AgentsRoles, nullable: true}) role?: AgentsRoles,
    @Args('page', {type: () => Int, nullable: true}) page?: number,
    @Args('limit', {type: () => Int, nullable: true}) limit?: number
  ) {
    return this.vcBrokerageGraphqlAPIService.getUserVCs(req?.userDid, vcType, role, page, limit);
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
    @Context('req') req: { userDid?: string },
    @Args('vcDid', {type: () => String}) vcDid: Did,
    @Args('verifierDid', {type: () => String}) verifierDid: Did): Promise<boolean>
  {
    return this.vcBrokerageGraphqlAPIService.requestVcVerification(req?.userDid, vcDid, verifierDid);
  }

  @Mutation(returns => Boolean)
  async verifyVC(
    @Context('req') req: { userDid?: string },
    @Args('verificationData', {type: () => String}) verificationData: string
  ) {
    return this.vcBrokerageGraphqlAPIService.verifyVc(req?.userDid, verificationData);
  }

  @Query(returns => [EventLogEntry])
  async getEventLogEntries(
    @Context('req') req: { userDid?: string },
    @Args('startIndex', {type: () => Int, nullable: true}) startIndex?: number,
    @Args('count', {type: () => Int, nullable: true}) count?: number
  ): Promise<EventLogEntry[]>
  {
    return this.vcBrokerageGraphqlAPIService.getEventLog(req?.userDid);
  }
}
