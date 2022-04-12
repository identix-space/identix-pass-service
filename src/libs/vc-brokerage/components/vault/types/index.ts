import {VCData} from "@/libs/vc-brokerage/types";

export enum WalletsKinds {
  CustodialLocalWallet = 'CUSTODIAL_LOCAL_WALLET',
}

export const VCStorageClientProvider = 'VC_STORAGE_CLIENT_PROVIDER';

export interface IVCStorageClient {
  createVC: (walletKind: WalletsKinds, did: string, vcData: VCData) => Promise<string>;
  readVC: (walletKind: WalletsKinds, did: string) => Promise<VCData>;
  updateVC: (walletKind: WalletsKinds, did: string, vcData: VCData) => Promise<void>;
  deleteVC: (walletKind: WalletsKinds, did: string) => Promise<void>;
}

export interface IVault {
  createVC: (did: string, vcData: VCData) => Promise<string>;
  readVC: (did: string) => Promise<VCData>;
  updateVC: (did: string, vcData: VCData) => Promise<void>;
  deleteVC: (did: string) => Promise<void>;
}

export type VCStorageConfigurationType = {}