import {Did} from "@/libs/vc-brokerage/types";

export enum BrokersStrategies  {
  simple = 'SIMPLE_BROKER'
}

export interface IVcBroker {
  connect: (party: Did) => Promise<Did>;
  issueVc: (session: Did) => Promise<Did>;
}

export type IVcBrokersFactory = (brokersStrategy: BrokersStrategies) => IVcBroker;