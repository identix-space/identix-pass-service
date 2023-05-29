import {Did} from "@/libs/vc-brokerage/types";
import {KeyValueType} from "@/libs/common/types";
import {VerificationStatuses} from "@/libs/vc-brokerage/types";
import {ClaimsGroup} from "@/libs/vc-brokerage/components/vc-brokers/types";


export enum WalletsStorageKinds {
  identixWalletsStorage = 'IDENTIX_WALLETS_STORAGE',
}

export const WalletsStorageClient = 'WALLETS_STORAGE_CLIENT';

export interface IWalletsStorageClient {
  getOrCreateAccount: (params: KeyValueType) => Promise<Did[]>;
  issueVC: (claimsGroup: ClaimsGroup[], issuerDid: Did) => Promise<string>;
  saveVC: (vcDid: Did, issuerDid: Did, holderDid: Did, vcData: string, vcSecret) => Promise<number>;
  getUserVCs: (userDid: Did, vcType: string) =>  Promise<WalletsVCData[]>;
  getVC: (vcDid: Did) => Promise<WalletsVCData>;
  requestVcVerification: (vcDid: Did, verifierDid: Did) => Promise<boolean>;
  verifyVC: (vcDid: Did, verificationData: string) => Promise<boolean>;
  generateVcDid: () => Promise<{vcDid: Did, vcSecret: string}>;
  sign: (userDid: Did, msg: string) => Promise<{signed: string, signature: string}>;
}

export type WalletsStorageConfiguration = {
  walletsStorageUrl: string;
  walletsApiToken: string;
}

export interface WalletsVCData {
  vcDid: Did,
  vcData: Did,
  issuerDid: Did,
  holderDid: string,
  verificationCases: {
    verifierDid: Did,
    verificationStatus: VerificationStatuses
  }[]
}