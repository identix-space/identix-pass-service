import { VCData, Did } from "@/libs/vc-brokerage/types";
import { KeyValueType} from "@/libs/common/types";
import { IdentixWalletsStorageClient } from "@/libs/wallets-storage-client/clients/identix-wallets.client";

export class WalletsStorageService {
    constructor(
      protected readonly walletsStorageClient: IdentixWalletsStorageClient
    ) {}

    public async getOrCreateAccount(params: KeyValueType): Promise<Did[]> {
        return this.walletsStorageClient.getOrCreateAccount(params);
    }

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
