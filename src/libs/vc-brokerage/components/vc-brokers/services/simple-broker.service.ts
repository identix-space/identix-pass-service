import {IWalletsStorageClient} from "@/libs/wallets-storage-client/types";
import {Did, VC} from "@/libs/vc-brokerage/types";
import {IVcBroker} from "@/libs/vc-brokerage/components/vc-brokers/types";
import {IMessagingClient} from "@/libs/messaging/types";
import {IVcScheme, IVcSchemesClient} from "@/libs/vc-brokerage/components/vc-schemes/types";
import {KeyValueType} from "@/libs/common/types";
import {vcTemplate} from "../constants/vc-template";
import {credentialSubjectStateId, credentialSubjectProofOfResidency} from "../factories/credential-subjetcs.factories";

import hmac from 'js-crypto-hmac';
import jseu from 'js-encoding-utils';

import {BadRequestException} from "@nestjs/common";

export class SimpleBrokerService implements IVcBroker{
  constructor(
    private messagingClient: IMessagingClient,
    private walletsStorageClient: IWalletsStorageClient,
    private vcSchemes: IVcSchemesClient
  ) {}

  async buildVc(issuerDid: Did, holderDid: Did, vcTypeScheme: IVcScheme, vcParams: string): Promise<VC> {
    let vcParamsObj;
    try {
      vcParamsObj = JSON.parse(vcParams);
    } catch (e) {
      const params = {issuerDid, holderDid, vcTypeDid: vcTypeScheme.did, vcParams };
      throw new Error(`Invalid vcParams data. Parameter vsParams should be JSON string. Params: ${JSON.stringify(params)}`);
    }

    const {vcDid, vcSecret} = await this.walletsStorageClient.generateVcDid();

    const vcObj = {
      vcDid,
      vcTypeDid: vcTypeScheme.did,
      vcParams: vcParamsObj,
      issuerDid: issuerDid,
      holderDid: holderDid,
      verificationCases: [],
      createdAt: (new Date()).toISOString(),
      updatedAt: (new Date()).toISOString()
    } as VC;

    const vc = {} as VC;
    vc.vcDid = vcObj.vcDid;
    vc.vcTypeDid = vcObj.vcTypeDid;
    vc.issuerDid = vcObj.issuerDid;
    vc.holderDid = vcObj.holderDid;
    vc.verificationCases = vcObj.verificationCases;
    vc.createdAt = vcObj.createdAt;
    vc.updatedAt = vcObj.updatedAt;

    vc.vcRawText = await this.generateVCRawText(vcObj, vcParamsObj, vcSecret);
    vc.vcParams = JSON.stringify(vcParamsObj);

    return vc;
  }

  private async generateVCRawText(vc: VC, vcParamsObj: KeyValueType, vcSecret: string): Promise<string> {
    const vcRawTextObj = vcTemplate;

    vcRawTextObj.payload.iss = vc.issuerDid;
    vcRawTextObj.payload.aud = [];
    vcRawTextObj.payload.nbf = String((new Date()).getTime());
    vcRawTextObj.payload.iat = String((new Date()).getTime());
    vcRawTextObj.payload.jti = vc.vcDid;
    vcRawTextObj.payload.vc.credentialSubject = await this.generateSubjectState(vc, vcParamsObj, vcSecret);
    vcRawTextObj.jwt = await this.generateJWT(vcRawTextObj.header, vcRawTextObj.payload, vc.issuerDid);

    return JSON.stringify(vcRawTextObj);
  }

  private async generateSubjectState(vc: VC, vcParamsObj: KeyValueType, vcSecret: string): Promise<KeyValueType> {
    try {
      const credentialSubjectTmpl = credentialSubjectStateId(vc.holderDid, vcParamsObj);
      const credentialSubject = [];

      for await (const group of credentialSubjectTmpl.groups) {
        const {id, claims} = group;

        const key = jseu.encoder.stringToArrayBuffer(vcSecret);
        const msg = jseu.encoder.stringToArrayBuffer(JSON.stringify({id, claims}));
        const signatureHash = jseu.encoder.arrayBufferToString(await hmac.compute(key, msg, 'SHA-256'))
        const signature = await this.walletsStorageClient.sign(vc.issuerDid, signatureHash);

        credentialSubject.push({id, claims, signature});
      }

      return credentialSubject;
    } catch (e) {
      throw new BadRequestException(`Could not generate subject state: ${JSON.stringify({vc, vcParams: vcParamsObj})}`)
    }
  }

  private async generateJWT(header: KeyValueType, payload: KeyValueType, issuerDid: Did): Promise<string> {
    const base64Header = Buffer.from(JSON.stringify(header), 'binary').toString('base64')
    const base64Payload = Buffer.from(JSON.stringify(payload), 'binary').toString('base64');
    const signatureHash = `${base64Header}.${base64Payload}`;
    const signature = await this.walletsStorageClient.sign(issuerDid, signatureHash);
    return `${base64Header}.${base64Payload}.${Buffer.from(signature, 'binary').toString('base64')}`;
  }
}
