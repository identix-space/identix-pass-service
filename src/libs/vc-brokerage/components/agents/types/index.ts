import {IVcSchema, Did, IVcMessage} from "@/libs/vc-brokerage/types";

export enum AgentsRoles {
  Issuer = 'ISSUER',
  Holder = 'HOLDER',
  Verifier = 'VERIFIER',
}

export interface IAgent {
  configure: (did: Did, vcIssuerSchemas: IVcSchema[]) => void;
  subscribe: (queue: string, handler: () => Promise<void>) => void;
  requestVcIssuer: (issuerDid: Did, vcSchemeDid: Did) => Promise<IVcMessage>;
  issueVc: (holderDid: Did, vcSchemeDid: Did) => Promise<IVcMessage>;
}

export interface IAgentsSessionsRegistry {
  createAgentSession: () => void;
  deleteAgentSession: () => void;
  getAgent: () => IAgent;
}