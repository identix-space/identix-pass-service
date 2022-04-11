import { Injectable } from '@nestjs/common';
import { BaseAgentService } from './base/base.agent.service';
import { AgentsRoles } from "@/libs/vc-brokerage/components/agents/types";

@Injectable()
export class VerifierService extends BaseAgentService {
  constructor(public readonly did: string) {
    super(did, AgentsRoles.Verifier);
  }

  public async verifyVC(issuerDid: string, holderDid: string, vcDid: string, vcSchemeDid: string): Promise<void> {
    return;
  }
}