import {IWalletsStorageClient} from "@/libs/wallets-storage-client/types";
import {Did, VCData} from "@/libs/vc-brokerage/types";
import {BaseStorageWalletsClient} from "@/libs/wallets-storage-client/clients/base-storage-wallets.client";
import {KeyValueType} from "@/libs/common/types";
import {faker} from "@faker-js/faker";

export class IdentixWalletsStorageClient extends BaseStorageWalletsClient implements IWalletsStorageClient {
  private readonly walletsStorageUrl: string;

  constructor(walletsStorageUrl: string) {
    super();
    this.walletsStorageUrl = walletsStorageUrl;
  }

  public async getOrCreateAccount(params: KeyValueType): Promise<Did[]> {
    return [`did:ever:user:${faker.random.alphaNumeric(30)}`];
  }

  public async createVC(did: string, vcData: VCData): Promise<string> {
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
