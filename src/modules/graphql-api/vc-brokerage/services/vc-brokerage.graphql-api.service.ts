import {Injectable} from "@nestjs/common";
import {AgentsRoles, Did, VC} from "@/libs/vc-brokerage/types";

@Injectable()
export class VCBrokerageGraphqlApiService {
  constructor() {}

  async getUserVCs(role?: AgentsRoles, page?: number, limit?: number): Promise<VC[]> {
    return [];
  }

  async issuerVc(holderDid: Did, vcTypeDid: Did, vcParams: string): Promise<boolean> {
    return true;
  }
}
