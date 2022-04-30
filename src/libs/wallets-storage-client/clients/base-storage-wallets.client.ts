import {Injectable} from "@nestjs/common";
import { IWalletsStorageClient } from "@/libs/wallets-storage-client/types";
import { VCData } from "@/libs/vc-brokerage/types";

@Injectable()
export class BaseStorageWalletsClient implements IWalletsStorageClient {
  constructor() {}

  public async  createVC(did: string, vcData: VCData): Promise<string> {
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
