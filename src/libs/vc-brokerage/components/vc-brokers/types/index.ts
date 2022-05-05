import {Did, VC} from "@/libs/vc-brokerage/types";
import {IVcScheme} from "@/libs/vc-brokerage/components/vc-schemes/types";

export const VcBrokers = 'VC_BROKERS';

export enum BrokersStrategies  {
  simple = 'SIMPLE_BROKER'
}

export interface IVcBroker {
  buildVc: (issuerDid: Did, holderDid: Did, vcTypeScheme: IVcScheme, vcParams: string) => Promise<VC>;
}

export interface IVcBrokersProvider {
  getBroker: (brokerStrategy: BrokersStrategies) => IVcBroker;
}

export type IVcBrokersFactory = (brokersStrategy: BrokersStrategies) => IVcBrokersProvider;
