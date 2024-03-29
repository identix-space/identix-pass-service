import {IWalletsStorageClient} from "@/libs/wallets-storage-client/types";
import {Did, VC} from "@/libs/vc-brokerage/types";
import {ClaimsGroup, IVcBroker} from "@/libs/vc-brokerage/components/vc-brokers/types";
import {IMessagingClient} from "@/libs/messaging/types";
import {IVcScheme} from "@/libs/vc-brokerage/components/vc-schemes/types";
import {KeyValueType} from "@/libs/common/types";
import {vcTemplate} from "../constants/vc-template";
import {credentialSubjectStateId, 
  credentialSubjectProofOfResidency, 
  credentialSubjectEmiratesId, 
  credentialSubjectRealEstate
} from "../factories/credential-subjetcs.factories";

import * as hmacSHA256 from 'crypto-js/hmac-sha256';

import {BadRequestException} from "@nestjs/common";
import {faker} from "@faker-js/faker";

export class SimpleBrokerService implements IVcBroker{
  constructor(
    private messagingClient: IMessagingClient,
    private walletsStorageClient: IWalletsStorageClient
  ) {}

  async buildVc(issuerDid: Did, holderDid: Did, vcTypeScheme: IVcScheme, vcParams: string): Promise<{vc: VC, vcSecret: string}> {
    let vcParamsObj;
    try {
      vcParamsObj = JSON.parse(vcParams);
    } catch (e) {
      const params = {issuerDid, holderDid, vcTypeDid: vcTypeScheme.did, vcParams };
      throw new Error(`Invalid vcParams data. Parameter vsParams should be JSON string. Params: ${JSON.stringify(params)}`);
    }

    const vcSecret = faker.random.alphaNumeric(30);
    const credentialSubject =
      await this.generateCredentialSubject(
        issuerDid,
        holderDid,
        vcTypeScheme,
        vcParamsObj,
        vcSecret
      );
    const vcDid = await this.deployVcAndCreateVcDid(credentialSubject, issuerDid, vcSecret);

    const vc = {} as VC;
    vc.vcDid = vcDid;
    vc.vcParams = vcParamsObj;
    vc.vcTypeDid = vcTypeScheme.did;
    vc.issuerDid = issuerDid;
    vc.holderDid = holderDid;
    vc.verificationCases = [];
    vc.createdAt = (new Date()).toISOString();
    vc.updatedAt = (new Date()).toISOString();

    vc.vcRawText = await this.generateVCRawText(vc, credentialSubject);
    vc.vcParams = JSON.stringify(vcParamsObj);

    return {vc, vcSecret};
  }

  private async generateCredentialSubject(
    issuerDid: Did,
    holderDid: Did,
    vcTypeScheme: IVcScheme,
    vcParamsObj: KeyValueType,
    vcSecret: string
  ): Promise<KeyValueType> {
    try {
      let credentialSubjectHolder: (userDid: Did, params: KeyValueType) => KeyValueType;

      if (vcTypeScheme.key === 'STATE_ID') {
        credentialSubjectHolder = credentialSubjectStateId;
      } else if (vcTypeScheme.key === 'PROOF_OF_RESIDENCY') {
        credentialSubjectHolder = credentialSubjectProofOfResidency;
      } else if (vcTypeScheme.key === 'EMIRATES_ID') {
        credentialSubjectHolder = credentialSubjectEmiratesId;
      } else if (vcTypeScheme.key === 'REAL_ESTATE') {
        credentialSubjectHolder = credentialSubjectRealEstate;
      } else {
        throw new BadRequestException('Unknown VC type')
      }

      const credentialSubjectTmpl = credentialSubjectHolder.call(this, holderDid, vcParamsObj);
      const credentialSubject = [];

      for await (const group of credentialSubjectTmpl.groups) {
        const {id, claims} = group;

        const hmacMsgHash = hmacSHA256(JSON.stringify({id, claims}), vcSecret);
        const hmacMsgHashBase64 = Buffer.from(JSON.stringify(hmacMsgHash), 'binary').toString('base64');

        const signResult = await this.walletsStorageClient.sign(issuerDid, hmacMsgHashBase64);
        const { signed } = signResult;

        credentialSubject.push({id, claims, signature: signed});
      }

      return credentialSubject;
    } catch (e) {
      throw new BadRequestException(`Could not generate subject state: ${JSON.stringify({
        issuerDid,
        holderDid,
        vcType: vcTypeScheme.key,
        vcParams: vcParamsObj})
      }`)
    }
  }

  private async generateVCRawText(vc: VC, credentialSubject: KeyValueType): Promise<string> {
    const vcRawTextObj = vcTemplate;

    vcRawTextObj.payload.iss = vc.issuerDid;
    vcRawTextObj.payload.aud = [];
    vcRawTextObj.payload.nbf = String((new Date()).getTime());
    vcRawTextObj.payload.iat = String((new Date()).getTime());
    vcRawTextObj.payload.jti = vc.vcDid;
    vcRawTextObj.payload.vc.id = vc.vcDid;
    vcRawTextObj.payload.vc.credentialSubject = credentialSubject;
    vcRawTextObj.jwt = await this.generateJWT(vcRawTextObj.header, vcRawTextObj.payload, vc.issuerDid);

    return JSON.stringify(vcRawTextObj);
  }

  private async generateJWT(header: KeyValueType, payload: KeyValueType, issuerDid: Did): Promise<string> {
    const base64Header = Buffer.from(JSON.stringify(header), 'binary').toString('base64');
    const base64Payload = Buffer.from(JSON.stringify(payload), 'binary').toString('base64');
    const signatureHash = `${base64Header}.${base64Payload}`;
    const {signed} = await this.walletsStorageClient.sign(issuerDid, signatureHash);

    return `${base64Header}.${base64Payload}.${Buffer.from(signed, 'binary').toString('base64')}`;
  }

  private async deployVcAndCreateVcDid(credentialSubject: KeyValueType, issuerDid: Did, vcSecret: string): Promise<Did> {
    const claimsGroups = await this.generateClaimsGroups(credentialSubject, issuerDid, vcSecret);
    return this.walletsStorageClient.issueVC(claimsGroups, issuerDid);
  }

  private async generateClaimsGroups(credentialSubject: KeyValueType, issuerDid: Did, vcSecret: string): Promise<ClaimsGroup[]> {
    const groups: any = credentialSubject;
    const claimsGroups: ClaimsGroup[] = [];

    for await (const group of groups) {
      const {id, claims} = group;

      const signGroupsMsg = hmacSHA256(JSON.stringify({id, claims}), vcSecret).toString();
      const {signature} = await this.walletsStorageClient.sign(issuerDid, signGroupsMsg);
      const signGroupsLength = Buffer.from(signature).length;

      claimsGroups.push({
        hmacHigh_groupDid: Buffer.from(hmacSHA256(id, vcSecret).toString(), 'utf-8').subarray(0, 8).toString('hex'),
        hmacHigh_claimGroup: Buffer.from(hmacSHA256(JSON.stringify({claims}), vcSecret).toString(), 'utf-8').subarray(0, 8).toString('hex'),
        signLowPart:  Buffer.from(signature).subarray(0, 32).toString('hex'),
        signHighPart: Buffer.from(signature).subarray(Math.max(0, signGroupsLength - 32), signGroupsLength).toString('hex'),
      });
    }

    return claimsGroups;
  }


}
