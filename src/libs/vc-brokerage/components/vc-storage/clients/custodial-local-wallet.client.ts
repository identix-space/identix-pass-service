import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {VCStorageEntity, VCSchemesEntity} from "@/libs/database/entities";
import {Repository} from "typeorm";
import {IWalletClient} from "@/libs/vc-brokerage/components/vc-storage/types";
import {VCData} from "@/libs/vc-brokerage/types";

@Injectable()
export class CustodialLocalWalletClient implements IWalletClient {
  constructor(
    @InjectRepository(VCStorageEntity)
    private vcStorageRepository: Repository<VCStorageEntity>,
    @InjectRepository(VCSchemesEntity)
    private vcSchemesEntityRepository: Repository<VCSchemesEntity>
  ) {}

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