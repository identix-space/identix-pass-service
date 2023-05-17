import {Did, VerificationStatuses} from "@/libs/vc-brokerage/types";
import { KeyValueType} from "@/libs/common/types";
import { IdentixWalletsStorageClient } from "@/libs/wallets-storage-client/clients/identix-wallets.client";
import {WalletsVCData} from "@/libs/wallets-storage-client/types";
import {faker} from "@faker-js/faker";
import {did} from "@/libs/common/helpers/strings.helpers";

export class WalletsStorageService {
  constructor(
    protected readonly walletsStorageClient: IdentixWalletsStorageClient
  ) {}

  public async issueVC(id: number): Promise<string> {
    return this.walletsStorageClient.issueVC(id);
  }

  public async getOrCreateAccount(params: KeyValueType): Promise<Did[]> {
    return this.walletsStorageClient.getOrCreateAccount(params);
  }

  public async saveVC(vcDid: Did, issuerDid: Did, holderDid: Did, vcData: string, vcSecret: string): Promise<number> {
    return this.walletsStorageClient.saveVC(vcDid, issuerDid, holderDid, vcData, vcSecret);
  }

  async getUserVCs(userDid: Did): Promise<WalletsVCData[]> {
    return this.walletsStorageClient.getUserVCs(userDid);
  }

  async getVC(vcDid: Did): Promise<WalletsVCData> {
    return this.walletsStorageClient.getVC(vcDid);
  }

  async requestVcVerification(vcDid: Did, verifierDid: Did): Promise<boolean> {
    return this.walletsStorageClient.requestVcVerification(vcDid, verifierDid);
  }

  async verifyVC(vcDid: Did, verifierDid: Did, verificationStatus: VerificationStatuses): Promise<boolean> {
    return this.walletsStorageClient.verifyVC(vcDid, verifierDid, verificationStatus)
  }

  async generateVcDid(): Promise<{vcDid: Did, vcSecret: string}> {
    return {
      vcDid: did(),
      vcSecret: faker.random.alphaNumeric(30)
    }
  }

  async sign(userDid: Did, msg: string): Promise<{signed: string, signature: string}> {
    return this.walletsStorageClient.sign(userDid, msg);
    //return faker.random.alphaNumeric(64);
  }
}
