import {Did, VCData} from "@/libs/vc-brokerage/types";
import {KeyValueType} from "@/libs/common/types";

export enum WalletsStorageKinds {
  identixWalletsStorage = 'IDENTIX_STORAGE_WALLETS',
}

export const WalletsStorageClient = 'WALLETS_STORAGE_CLIENT';

export interface IWalletsStorageClient {
  getOrCreateAccount: (params: KeyValueType) => Promise<Did[]>;
  createVC: (vcDid: Did, issuerDid: Did, holderDid: Did, vcData: string) => Promise<void>;
  readVC: (did: string) => Promise<VCData>;
  updateVC: (did: string, vcData: VCData) => Promise<void>;
  deleteVC: (did: string) => Promise<void>;
}

export type WalletsStorageConfiguration = {
  walletsStorageUrl: string;
  walletsApiToken: string;
}
