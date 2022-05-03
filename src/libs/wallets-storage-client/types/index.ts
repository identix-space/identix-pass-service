import {Did} from "@/libs/vc-brokerage/types";
import {KeyValueType} from "@/libs/common/types";
import {VerificationStatuses} from "@/libs/vc-brokerage/types";


export enum WalletsStorageKinds {
  identixWalletsStorage = 'IDENTIX_WALLETS_STORAGE',
}

export const WalletsStorageClient = 'WALLETS_STORAGE_CLIENT';

export interface IWalletsStorageClient {
  getOrCreateAccount: (params: KeyValueType) => Promise<Did[]>;
  createVC: (vcDid: Did, issuerDid: Did, holderDid: Did, vcData: string) => Promise<void>;
  getUserVCs: (userDid: Did) =>  Promise<WalletsVCData[]>;
  getVC: (vcDid: Did) => Promise<WalletsVCData>;
  requestVcVerification: (vcDid: Did, verifierDid: Did) => Promise<boolean>;
  verifyVC: (vcDid: Did, verifierDid: Did, verificationStatus: VerificationStatuses) => Promise<boolean>;
  generateVcDid: () => Promise<{vcDid: Did, vcSecret: string}>;
  sign: (userDid: Did, msg: string) => Promise<string>;
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
