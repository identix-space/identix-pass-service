import { Injectable } from '@nestjs/common';
import { BaseAgentService } from './base/base.agent.service';
import { AgentsRoles } from "@/libs/vc-brokerage/components/agents/types";
import { VCData } from "@/libs/vc-brokerage/types";

@Injectable()
export class IssuerService extends BaseAgentService {
  constructor(public readonly did: string) {
    super(did, AgentsRoles.Holder);
  }

  public async createVC(issuerDid: string, vc: VCData, schemeDid: string): Promise<string> { // returns VC did
    return;
  }

  public async updateVC(issuerDid: string, vcDid: string, schemeDid: string, vc: VCData): Promise<void> {
    return;
  }

  public async deleteVC(issuerDid: string, vcDid: string): Promise<void> {
    return;
  }
}