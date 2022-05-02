import {IWalletsStorageClient, WalletsVCData} from "@/libs/wallets-storage-client/types";
import {Did, VerificationStatuses} from "@/libs/vc-brokerage/types";
import { KeyValueType } from "@/libs/common/types";

export class BaseStorageWalletsClient implements IWalletsStorageClient {
  constructor() {}

  public async getOrCreateAccount(params: KeyValueType): Promise<Did[]> {
    return;
  }

  public async createVC(vcDid: Did, issuerDid: Did, holderDid: Did, vcData: string): Promise<void> {
    return;
  }

  public async getUserVCs(userDid: Did): Promise<WalletsVCData[]> {
    return
  }

  public async getVC(vcDid: Did): Promise<WalletsVCData> {
    return;
  }

  async requestVcVerification(vcDid: Did, verifierDid: Did): Promise<boolean> {
    return true
  }

  async verifyVC(vcDid: Did, verifierDid: Did, verificationStatus: VerificationStatuses): Promise<boolean> {
    return true
  }
}
