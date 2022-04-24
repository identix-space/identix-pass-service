import {Injectable} from "@nestjs/common";
import {VCData} from "@/libs/vc-brokerage/types";
import {IVcVault} from "@/libs/wallets-storage-client/types";

@Injectable()
export class VcStorageService {
    constructor(
      protected readonly walletClient: IVcVault
    ) {}

    public async  createVC(did: string, vcData: VCData): Promise<string> {
        return this.walletClient.createVC(did, vcData);
    }

    public async readVC(did: string): Promise<VCData> {
        return this.walletClient.readVC(did);
    }

    public async  updateVC(did: string, vcData: VCData): Promise<void> {
        return this.walletClient.updateVC(did, vcData);
    }

    public async  deleteVC(did: string): Promise<void> {
        return this.walletClient.deleteVC(did);
    }
}
