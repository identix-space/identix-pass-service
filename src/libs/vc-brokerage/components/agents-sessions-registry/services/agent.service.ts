import {IMessagingClient} from "@/libs/messaging/types";
import {IVcBroker} from "@/libs/vc-brokerage/components/vc-brokers/types";
import {IVcScheme, IVcSchemesClient} from "@/libs/vc-brokerage/components/vc-schemes/types";
import {IWalletsStorageClient, WalletsVCData} from "@/libs/wallets-storage-client/types";
import {Did, VC} from "@/libs/vc-brokerage/types";

export class AgentService {
  constructor(
    private messagingClient: IMessagingClient,
    private vcBroker: IVcBroker,
    private vcSchemes: IVcSchemesClient,
    private walletsStorageClient: IWalletsStorageClient
  ) {}

  async issuerVc(issuerDid: Did, holderDid: Did, vcTypeDid: Did, vcParams: string): Promise<Did> {
     const vcTypeScheme: IVcScheme = this.vcSchemes.getSchemes({ did: vcTypeDid }).shift();
     if (!vcTypeScheme) {
       throw new Error(`Unknown vcType scheme. Params: ${JSON.stringify({vcTypeDid})}`);
     }
     const vcData: VC = await this.vcBroker.buildVc(issuerDid, holderDid, vcTypeScheme, vcParams);

     await this.walletsStorageClient.createVC(vcData.vcDid, issuerDid, holderDid, JSON.stringify(vcData));

     return vcData.vcDid;
  }

  async getUserVCs(userDid: Did): Promise<WalletsVCData[]> {
    return this.walletsStorageClient.getUserVCs(userDid);
  }

  async getVC(vcDid: Did): Promise<WalletsVCData> {
    return this.walletsStorageClient.getVC(vcDid);
  }
}
