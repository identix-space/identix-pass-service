import {VCData, Did, VC} from "@/libs/vc-brokerage/types";
import { KeyValueType} from "@/libs/common/types";
import { IdentixWalletsStorageClient } from "@/libs/wallets-storage-client/clients/identix-wallets.client";
import {WalletsVCData} from "@/libs/wallets-storage-client/types";

export class WalletsStorageService {
  constructor(
    protected readonly walletsStorageClient: IdentixWalletsStorageClient
  ) {}

  public async getOrCreateAccount(params: KeyValueType): Promise<Did[]> {
    return this.walletsStorageClient.getOrCreateAccount(params);
  }

  public async  createVC(vcDid: Did, issuerDid: Did, holderDid: Did, vcData: string): Promise<void> {
    return this.walletsStorageClient.createVC(vcDid, issuerDid, holderDid, vcData);
  }

  async getUserVCs(userDid: Did): Promise<WalletsVCData[]> {
    return this.walletsStorageClient.getUserVCs(userDid);
  }

  async getVC(vcDid: Did): Promise<WalletsVCData> {
    return this.walletsStorageClient.getVC(vcDid);
  }
}
