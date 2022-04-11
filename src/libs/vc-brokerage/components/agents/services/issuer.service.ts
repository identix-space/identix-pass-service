import { Injectable } from '@nestjs/common';
import { BaseAgentService } from './base/base.agent.service';
import { AgentsRoles } from "@/libs/vc-brokerage/components/agents/types";
import { VCData } from "@/libs/vc-brokerage/types";

@Injectable()
export class IssuerService extends BaseAgentService {
  constructor(public readonly did: string) {
    super(did, AgentsRoles.Issuer);
  }

  public async addIssuerVCScheme(scheme: string): Promise<string> { // returns VC Scheme did
    return;
  }

  public async getIssuerVCSchemes(): Promise<Map<string, string>> { // returns Map<schemeDid, jsonStringScheme>
    return new Map<string, string>();
  }

  public async saveVCData(vc: VCData, schemeDid: string): Promise<string> { // returns VC did
    return;
  }

  public async updateVCData(vcDid: string, schemeDid: string, vc: VCData): Promise<void> {
    return;
  }

  public async deleteVCData(vcDid: string): Promise<void> {
    return;
  }

  public async getVCData(vcDid: string): Promise<VCData> {
    return;
  }

  private async verifyVCData(vc: VCData, schemeDid: string): Promise<boolean> {
    return true;
  }
}