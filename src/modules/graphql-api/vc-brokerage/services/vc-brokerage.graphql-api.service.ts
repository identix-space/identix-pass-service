import {Inject, Injectable} from "@nestjs/common";
import {AgentsRoles, Did, VC} from "@/libs/vc-brokerage/types";
import {VCHelper, VCTypes} from "@/modules/graphql-api/vc-brokerage/services/vc.helper";
import {
  AgentsSessionsRegistry,
  IAgentsSessionsRegistry
} from "@/libs/vc-brokerage/components/agents-sessions-registry/types";

@Injectable()
export class VCBrokerageGraphqlApiService {
  private vcHelper: VCHelper;

  constructor(
    @Inject(AgentsSessionsRegistry) private agentsSessionsRegistry: IAgentsSessionsRegistry
  ) {
    this.vcHelper = new VCHelper();
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
    const agentsRoles = [AgentsRoles.issuer, AgentsRoles.holder, AgentsRoles.verifier];
    const vcTypes = [VCTypes.stateId, VCTypes.proofOfResidency];
    const role = agentsRoles[Math.floor(Math.random() * 3)];
    const vcType = vcTypes[Math.floor(Math.random() * 3)];

    const vc = this.vcHelper.generateVC(role, userDid, vcType);
    vc.vcDid = vcDid;

    return vc;
  }

  async getUserVCs(userDid: Did, role?: AgentsRoles, page?: number, limit?: number): Promise<VC[]> {
    if (role) {
      return [
        this.vcHelper.generateVC(role, userDid, VCTypes.stateId),
        this.vcHelper.generateVC(role, userDid, VCTypes.proofOfResidency),
        this.vcHelper.generateVC(role, userDid, VCTypes.stateId),
        this.vcHelper.generateVC(role, userDid, VCTypes.proofOfResidency),
        this.vcHelper.generateVC(role, userDid, VCTypes.stateId)
      ]
    }
    return [
      this.vcHelper.generateVC(AgentsRoles.issuer, userDid, VCTypes.stateId),
      this.vcHelper.generateVC(AgentsRoles.holder, userDid, VCTypes.proofOfResidency),
      this.vcHelper.generateVC(AgentsRoles.verifier, userDid, VCTypes.stateId),
      this.vcHelper.generateVC(AgentsRoles.verifier, userDid, VCTypes.proofOfResidency),
      this.vcHelper.generateVC(AgentsRoles.holder, userDid, VCTypes.stateId),
      this.vcHelper.generateVC(AgentsRoles.issuer, userDid, VCTypes.stateId),
      this.vcHelper.generateVC(AgentsRoles.issuer, userDid, VCTypes.proofOfResidency),
      this.vcHelper.generateVC(AgentsRoles.holder, userDid, VCTypes.stateId),
      this.vcHelper.generateVC(AgentsRoles.holder, userDid, VCTypes.proofOfResidency),
      this.vcHelper.generateVC(AgentsRoles.issuer, userDid, VCTypes.stateId)
    ];
  }
}
