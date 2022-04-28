import {Injectable} from "@nestjs/common";
import {AgentsRoles, Did, VC} from "@/libs/vc-brokerage/types";

@Injectable()
export class VCBrokerageGraphqlApiService {
  constructor() {}

  async getUserVCs(role?: AgentsRoles): Promise<VC[]> {
    return [];
  }

  async checkAccountExists(did: Did): Promise<boolean> {
    return true;
  }
}
