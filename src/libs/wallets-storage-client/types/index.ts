import {VCData} from "@/libs/vc-brokerage/types";

export enum WalletsStorageKinds {
  identixWalletsStorage = 'IDENTIX_STORAGE_WALLETS',
}

export const WalletsStorageClient = 'VC_STORAGE_CLIENT';

export interface IWalletsStorageClient {
  createVC: (did: string, vcData: VCData) => Promise<string>;
  readVC: (did: string) => Promise<VCData>;
  updateVC: (did: string, vcData: VCData) => Promise<void>;
  deleteVC: (did: string) => Promise<void>;
}

export type WalletsStorageConfiguration = {
  walletsStorageUrl: string;
}
