import {IVcSchema, Did, IVcMessage, IIssueVcProperties} from "@/libs/vc-brokerage/types";
import {AgentService} from "@/libs/vc-brokerage/components/agents-sessions-registry/services/agent.service";

export const AgentsSessionsRegistry = 'AGENTS_SESSION_REGISTRY';

export enum AgentsRoles {
  Issuer = 'ISSUER',
  Holder = 'HOLDER',
  Verifier = 'VERIFIER',
}

export interface IAgent {
  configure: (did: Did, vcIssuerSchemas: IVcSchema[]) => void;
  subscribe: (queue: string, handler: () => Promise<void>, checkDuration?: number) => void;
  requestVcIssuer: (issuerDid: Did, vcSchemeDid: Did) => Promise<IVcMessage>;
  issueVc: (holderDid: Did, vcSchemeDid: Did, properties: IIssueVcProperties) => Promise<IVcMessage>;
  verifyVc: (holderDid: Did, consumerDid: Did, vcDid: Did) => Promise<void>;
}

export interface IAgentsSessionsRegistry {
  createAgentSession: (userDid: Did) => void;
  deleteAgentSession: (userDid: Did) => void;
  getAgent: (userDid: Did) => AgentService;
}
