import {IMessagingClient} from "@/libs/messaging/types";
import {IVcBroker} from "@/libs/vc-brokerage/components/vc-brokers/types";
import {IVcScheme, IVcSchemesClient} from "@/libs/vc-brokerage/components/vc-schemes/types";
import {IWalletsStorageClient, WalletsVCData} from "@/libs/wallets-storage-client/types";
import {Did, VC, VerificationStatuses} from "@/libs/vc-brokerage/types";
import {Repository} from "typeorm";
import {EventLogEntity} from "@/libs/database/entities";
import {EventTypes} from "@/libs/database/types/event-types.type";
import { HttpService } from "@nestjs/axios";

export class AgentService {
  constructor(
    private readonly agentDid: Did,
    private messagingClient: IMessagingClient,
    private vcBroker: IVcBroker,
    private vcSchemes: IVcSchemesClient,
    private walletsStorageClient: IWalletsStorageClient,
    private eventLogRepository: Repository<EventLogEntity>,
    private httpService: HttpService,
  ) {}

  async getVcTypeSchemes(userDid: Did): Promise<IVcScheme[]> {
    return this.vcSchemes.getSchemes({ userDid });
  }

  async issueVC(issuerDid: Did, holderDid: Did, vcTypeDid: Did, vcParams: string): Promise<Did> {
     const vcTypeScheme: IVcScheme = this.vcSchemes.getSchemes({ vcTypeDid }).shift();
     if (!vcTypeScheme) {
       throw new Error(`Unknown vcType scheme. Params: ${JSON.stringify({vcTypeDid})}`);
     }
     const {vc, vcSecret} = await this.vcBroker.buildVc(issuerDid, holderDid, vcTypeScheme, vcParams);

     const id = await this.walletsStorageClient.saveVC(vc.vcDid, issuerDid, holderDid, JSON.stringify(vc), vcSecret);

     const eventLog = new EventLogEntity();
     eventLog.eventType = EventTypes.ISSUER_VC;
     eventLog.vcDid = vc.vcDid;
     eventLog.ownerDid = this.agentDid;

     eventLog.message = `Verifiable credentials has been issured. Data: ${JSON.stringify({holder: holderDid, "VC type": vcTypeScheme.key})}`;

     await this.eventLogRepository.save(eventLog);

     return vc.vcDid;
  }

  async getUserVCs(userDid: Did, vcType: string): Promise<WalletsVCData[]> {
    return this.walletsStorageClient.getUserVCs(userDid, vcType);
  }

  async getVC(vcDid: Did): Promise<WalletsVCData> {
    return this.walletsStorageClient.getVC(vcDid);
  }

  async requestVcVerification(vcDid: Did, verifierDid: Did): Promise<boolean> {
    await this.walletsStorageClient.requestVcVerification(vcDid, verifierDid);

    const eventLog = new EventLogEntity();
    eventLog.eventType = EventTypes.REQUEST_VC_VERIFICATION;
    eventLog.vcDid = vcDid;
    eventLog.ownerDid = this.agentDid;
    eventLog.message = `Verification requested. Data: ${JSON.stringify({verifier: verifierDid})}`;

    await this.eventLogRepository.save(eventLog);

    return true
  }

  async verifyVc(userDid: Did, verificationData: {titledid: string, reApiUrl: string}): Promise<boolean> {
    const vc = await this.walletsStorageClient.verifyVC(userDid, verificationData.titledid);

    if(vc) {
      const eventLog = new EventLogEntity();
      eventLog.eventType = EventTypes.VERIFICATED;
      eventLog.vcDid = vc.vcDid;
      eventLog.ownerDid = userDid;
      eventLog.message = `Credentials verified. Data: ${JSON.stringify({verificationData})}`;
      await this.eventLogRepository.save(eventLog);

      await this.httpService.patch(verificationData.reApiUrl, {success: true}).toPromise();
    } else {
      await this.httpService.patch(verificationData.reApiUrl, {success: false}).toPromise();
    }

    return !!vc
  }
}
