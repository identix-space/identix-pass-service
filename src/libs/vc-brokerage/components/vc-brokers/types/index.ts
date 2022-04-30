import {Did} from "@/libs/vc-brokerage/types";

export const VcBrokers = 'VC_BROKERS';

export enum BrokersStrategies  {
  simple = 'SIMPLE_BROKER'
}

export interface IVcBroker {
  connect: (party: Did) => Promise<Did>;
  issueVc: (session: Did) => Promise<Did>;
}

export interface IVcBrokersProvider {
  getBroker: (brokerStrategy: BrokersStrategies) => IVcBroker;
}

export type IVcBrokersFactory = (brokersStrategy: BrokersStrategies) => IVcBrokersProvider;
