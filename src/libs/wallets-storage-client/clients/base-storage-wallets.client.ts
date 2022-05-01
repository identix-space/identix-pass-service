import { IWalletsStorageClient } from "@/libs/wallets-storage-client/types";
import { VCData, Did } from "@/libs/vc-brokerage/types";
import { KeyValueType } from "@/libs/common/types";

export class BaseStorageWalletsClient implements IWalletsStorageClient {
  constructor() {}

  public async getOrCreateAccount(params: KeyValueType): Promise<Did[]> {
    return;
  }

  public async createVC(vcDid: Did, issuerDid: Did, holderDid: Did, vcData: string): Promise<void> {
    return;
  }

  public async readVC(did: string): Promise<VCData> {
    return;
  }

  public async  updateVC(did: string, vcData: VCData): Promise<void> {
    return;
  }

  public async  deleteVC(did: string): Promise<void> {
    return;
  }
}
