import {Injectable} from "@nestjs/common";
import {IWalletsStorageClient} from "@/libs/wallets-storage-client/types";
import {VCData} from "@/libs/vc-brokerage/types";
import {BaseStorageWalletsClient} from "@/libs/wallets-storage-client/clients/base-storage-wallets.client";

@Injectable()
export class IdentixWalletsStorageClient extends BaseStorageWalletsClient implements IWalletsStorageClient {
  private readonly walletsStorageUrl: string;

  constructor(walletsStorageUrl: string) {
    super();
    this.walletsStorageUrl = walletsStorageUrl;
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
