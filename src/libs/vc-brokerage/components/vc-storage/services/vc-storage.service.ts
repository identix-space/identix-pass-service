import {Injectable} from "@nestjs/common";
import {VCData} from "@/libs/vc-brokerage/types";
import {IWalletClient} from "@/libs/vc-brokerage/components/vc-storage/types";

@Injectable()
export class VcStorageService {
    constructor(
      protected readonly walletClient: IWalletClient
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