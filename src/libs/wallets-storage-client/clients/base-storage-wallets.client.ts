import {ClaimsGroup, IWalletsStorageClient, WalletsVCData} from "@/libs/wallets-storage-client/types";
import {Did, VerificationStatuses} from "@/libs/vc-brokerage/types";
import { KeyValueType } from "@/libs/common/types";
import {ClaimsGroup} from "@/libs/vc-brokerage/components/vc-brokers/types";

export class BaseStorageWalletsClient implements IWalletsStorageClient {
  constructor() {}

  public async getOrCreateAccount(params: KeyValueType): Promise<Did[]> {
    return;
  }

  public async issueVC(id: number): Promise<string> {
    return;
  }

  public async saveVC(vcDid: Did, issuerDid: Did, holderDid: Did, vcData: string, vcSecret: string): Promise<number> {
    return;
  }

  public async getUserVCs(userDid: Did, vcType: string, page: number, limit: number): Promise<WalletsVCData[]> {
    return
  }

  public async getVC(vcDid: Did): Promise<WalletsVCData> {
    return;
  }

  async requestVcVerification(vcDid: Did, verifierDid: Did): Promise<boolean> {
    return true
  }

  async verifyVC(vcDid: Did, verificationData: string): Promise<boolean> {
    return true
  }

  async generateVcDid(): Promise<{vcDid: Did, vcSecret: string}> {
    return;
  }

  async sign(userDid: Did, message: string): Promise<{signed: string, signature: string}> {
    return;
  }
}
