import {ForbiddenException, Inject, Injectable} from "@nestjs/common";
import {AgentsRoles, Did, VC, VerificationStatuses} from "@/libs/vc-brokerage/types";
import {
  AgentsSessionsRegistry,
  IAgentsSessionsRegistry
} from "@/libs/vc-brokerage/components/agents-sessions-registry/types";
import {WalletsVCData} from "@/libs/wallets-storage-client/types";
import {AgentService} from "@/libs/vc-brokerage/components/agents-sessions-registry/services/agent.service";

@Injectable()
export class VCBrokerageGraphqlApiService {
  constructor(@Inject(AgentsSessionsRegistry) private agentsSessionsRegistry: IAgentsSessionsRegistry) {}

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

    const vc: WalletsVCData = await this.getVCAndAuthorize(vcDid, userDid, userAgent);

    return JSON.parse(vc.vcData);
  }

  async getUserVCs(userDid: Did, role?: AgentsRoles, page?: number, limit?: number): Promise<VC[]> {
    const userAgent = this.agentsSessionsRegistry.getAgent(userDid);
    if (!userAgent) {
      throw new Error('User agent session not found');
    }

    return (await userAgent.getUserVCs(userDid)).map(wvc => JSON.parse(wvc.vcData));
  }

  async requestVcVerification(userDid: Did, vcDid: Did, verifierDid: Did): Promise<boolean> {
    const userAgent = this.agentsSessionsRegistry.getAgent(userDid);
    if (!userAgent) {
      throw new Error('User agent session not found');
    }

    await this.getVCAndAuthorize(vcDid, userDid, userAgent);

    return !!(await userAgent.requestVcVerification(vcDid, verifierDid));
  }

  async verifyVc(
    userDid: Did,
    vcDid: Did,
    verificationStatus: VerificationStatuses
  ): Promise<boolean> {
    const userAgent = this.agentsSessionsRegistry.getAgent(userDid);
    if (!userAgent) {
      throw new Error('User agent session not found');
    }

    await this.getVCAndAuthorize(vcDid, userDid, userAgent, AgentsRoles.verifier);

    const verifierDid = userDid;

    return !!(await userAgent.verifyVc(vcDid, verifierDid, verificationStatus));
  }

  private async getVCAndAuthorize(
    vcDid: Did, userDid: Did,
    userAgent: AgentService,
    userRoleShouldBe?: AgentsRoles
  ): Promise<WalletsVCData> {
    const vc: WalletsVCData = await userAgent.getVC(vcDid);

    if (!vc) {
      throw new Error(`VC not fount. Params: ${JSON.stringify({vcDid})}`)
    }

    const checkUserAsIssuer = vc.issuerDid === userDid;
    const checkUserAsHolder = vc.holderDid === userDid;
    const checkUserAsVerifier = Array.isArray(vc.verificationCases) &&
      vc.verificationCases.filter(vcc => vcc.verifierDid === userDid).length > 0;

    if (!userRoleShouldBe) {
      if (!checkUserAsIssuer && !checkUserAsHolder && !checkUserAsVerifier) {
        throw new ForbiddenException();
      }
    } else {
      if (userRoleShouldBe === AgentsRoles.issuer && !checkUserAsIssuer) {
        throw new ForbiddenException();
      }
      if (userRoleShouldBe === AgentsRoles.holder && !checkUserAsHolder) {
        throw new ForbiddenException();
      }
      if (userRoleShouldBe === AgentsRoles.verifier && !checkUserAsVerifier) {
        throw new ForbiddenException();
      }
    }

    return vc;
  }
}
