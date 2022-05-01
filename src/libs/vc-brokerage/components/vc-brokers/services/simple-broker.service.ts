import {Did, VC} from "@/libs/vc-brokerage/types";
import {IVcBroker} from "@/libs/vc-brokerage/components/vc-brokers/types";
import {IMessagingClient} from "@/libs/messaging/types";
import {IVcScheme} from "@/libs/vc-brokerage/components/vc-schemes/types";
import {KeyValueType} from "@/libs/common/types";
import {faker} from "@faker-js/faker";

export class SimpleBrokerService implements IVcBroker{
  constructor(messagingClient: IMessagingClient) {}

  async buildVc(issuerDid: Did, holderDid: Did, vcTypeScheme: IVcScheme, vcParams: string): Promise<VC> {
    let vcParamsObj;
    try {
      vcParamsObj = JSON.parse(vcParams);
    } catch (e) {
      const params = {issuerDid, holderDid, vcTypeDid: vcTypeScheme.did, vcParams };
      throw new Error(`Invalid vcParams data. Parameter vsParams should be JSON string. Params: ${JSON.stringify(params)}`);
    }

    const vcObj = {
      vcDid: this.generateRandomDid('ever:vc'),
      vcTypeDid: vcTypeScheme.did,
      vcParams: vcParamsObj,
      issuerDid: issuerDid,
      holderDid: holderDid,
      verificationCases: [],
      createdAt: (new Date()).toISOString(),
      updatedAt: (new Date()).toISOString()
    };

    const vc = {} as VC;
    vc.vcDid = vcObj.vcDid;
    vc.vcTypeDid = vcObj.vcTypeDid;
    vc.issuerDid = vcObj.issuerDid;
    vc.holderDid = vcObj.holderDid;
    vc.verificationCases = vcObj.verificationCases;
    vc.createdAt = vcObj.createdAt;
    vc.updatedAt = vcObj.updatedAt;
    vc.vcRawText = this.generateVCRawText(vcObj);
    vc.vcParams = JSON.stringify(vcParamsObj);

    return vc;
  }

  private generateRandomDid(description: string): Did {
    return `did:${description}:${faker.random.alphaNumeric(30)}`;
  }

  private generateVCRawText(vcObject: KeyValueType): string {
    return JSON.stringify(vcObject);
  }
}
