import {Inject, Injectable, ForbiddenException} from "@nestjs/common";
import {AgentsRoles, Did, VC} from "@/libs/vc-brokerage/types";
import {VCHelper, VCTypes} from "@/modules/graphql-api/vc-brokerage/services/vc.helper";
import {
  AgentsSessionsRegistry,
  IAgentsSessionsRegistry
} from "@/libs/vc-brokerage/components/agents-sessions-registry/types";
import {WalletsVCData} from "@/libs/wallets-storage-client/types";

@Injectable()
export class VCBrokerageGraphqlApiService {
  private vcHelper: VCHelper;

  constructor(
    @Inject(AgentsSessionsRegistry) private agentsSessionsRegistry: IAgentsSessionsRegistry
  ) {
    this.vcHelper = new VCHelper();
  }

  async getVcTypes(userDid: Did): Promise<{vcTypeDid: Did, vcTypeTag: string}[]> {
    const userAgent = this.agentsSessionsRegistry.getAgent(userDid);
    if (!userAgent) {
      throw new Error('Issuer agent session not found');
    }

    const vcTypeSchemes = await userAgent.getVcTypeSchemes(userDid);
    if (!Array.isArray(vcTypeSchemes)) {
      return [];
    }

    return vcTypeSchemes.map(sch => ({vcTypeDid: sch.did, vcTypeTag: sch.key}));
  }

  async issuerVc(issuerDid: Did, holderDid: Did, vcTypeDid: Did, vcParams: string): Promise<boolean> {
    const issuerAgent = this.agentsSessionsRegistry.getAgent(issuerDid);
    if (!issuerAgent) {
      throw new Error('Issuer agent session not found');
    }

    const holderAgent = this.agentsSessionsRegistry.getAgent(holderDid);
    if (!holderAgent) {
      await this.agentsSessionsRegistry.createAgentSession(holderDid);
    }

    await issuerAgent.issuerVc(issuerDid, holderDid, vcTypeDid, vcParams);

    return true;
  }

  async getVC(userDid: Did, vcDid: Did): Promise<VC> {
    const userAgent = this.agentsSessionsRegistry.getAgent(userDid);
    if (!userAgent) {
      throw new Error('User agent session not found');
    }

    const vc: WalletsVCData = await userAgent.getVC(vcDid);

    if (!vc) {
      throw new Error(`VC not fount. Params: ${JSON.stringify({vcDid})}`)
    }

    const checkUserAsIssuer = vc.issuerDid === userDid;
    const checkUserAsHolder = vc.holderDid === userDid;
    const checkUserAsVerifier = Array.isArray(vc.verificationCases) &&
      vc.verificationCases.filter(vcc => vcc.verifierDid === userDid).length > 0;
    if (!checkUserAsIssuer && !checkUserAsHolder && !checkUserAsVerifier) {
      throw new ForbiddenException();
    }

    return JSON.parse(vc.vcData);
  }

  async getUserVCs(userDid: Did, role?: AgentsRoles, page?: number, limit?: number): Promise<VC[]> {
    const userAgent = this.agentsSessionsRegistry.getAgent(userDid);
    if (!userAgent) {
      throw new Error('User agent session not found');
    }

    return (await userAgent.getUserVCs(userDid)).map(wvc => JSON.parse(wvc.vcData));
  }
}
