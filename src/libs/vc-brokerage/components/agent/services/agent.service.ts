import { Injectable } from '@nestjs/common';
import { BaseAgentService } from './base/base.agent.service';
import { AgentsRoles } from "@/libs/vc-brokerage/components/agent/types";
import { VCData } from "@/libs/vc-brokerage/types";
import {IVcMessageDb, IVcWallet} from "../../../../../../../vc-brokerage/src/vc-core/interfaces";
import {IVcBrokerComponent} from "../../../../../../../vc-brokerage/src/vc-core/control-interfaces";

@Injectable()
export class AgentService {
  constructor(
    private vault?: IVcVault,
    private _broker?: IVcBrokerComponent;
    private _msg?: IVcMessageDb;
    private _issuerSchemes?: VcScheme[];
  ) {

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