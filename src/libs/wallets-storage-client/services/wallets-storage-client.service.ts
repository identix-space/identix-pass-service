import { Injectable } from "@nestjs/common";
import { VCData } from "@/libs/vc-brokerage/types";
import {BaseStorageWalletsClient} from "@/libs/wallets-storage-client/clients/base-storage-wallets.client";

@Injectable()
export class WalletsStorageService {
    constructor(
      protected readonly walletsStorageClient: BaseStorageWalletsClient
    ) {}

    public async  createVC(did: string, vcData: VCData): Promise<string> {
        return this.walletsStorageClient.createVC(did, vcData);
    }

    public async readVC(did: string): Promise<VCData> {
        return this.walletsStorageClient.readVC(did);
    }

    public async  updateVC(did: string, vcData: VCData): Promise<void> {
        return this.walletsStorageClient.updateVC(did, vcData);
    }

    public async  deleteVC(did: string): Promise<void> {
        return this.walletsStorageClient.deleteVC(did);
    }
}
