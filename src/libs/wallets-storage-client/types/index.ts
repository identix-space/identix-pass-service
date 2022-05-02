import {Did, VC, VCData} from "@/libs/vc-brokerage/types";
import {KeyValueType} from "@/libs/common/types";

export enum VcVerificationStatusType {
  PendingVerify = "PENDING_VERIFY",
  Accepted = "ACCEPTED",
  Rejected = "REJECTED"
}

export enum WalletsStorageKinds {
  identixWalletsStorage = 'IDENTIX_WALLETS_STORAGE',
}

export const WalletsStorageClient = 'WALLETS_STORAGE_CLIENT';

export interface IWalletsStorageClient {
  getOrCreateAccount: (params: KeyValueType) => Promise<Did[]>;
  createVC: (vcDid: Did, issuerDid: Did, holderDid: Did, vcData: string) => Promise<void>;
  getUserVCs: (userDid: Did) =>  Promise<WalletsVCData[]>;
  getVC: (vcDid: Did) => Promise<WalletsVCData>;
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
    verificationStatus: VcVerificationStatusType
  }[]
}
