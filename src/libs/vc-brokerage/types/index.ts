import {Field, ObjectType, registerEnumType} from "@nestjs/graphql";

export interface VCData {
  [key: string]: string | number | boolean | VCData | VCData[] | null;
}

export enum VerificationStatuses {
  pendingApproval = 'PENDING_APPROVAL',
  approved = 'APPROVED',
  rejected = 'REJECTED'
}

registerEnumType(VerificationStatuses, {
  name: 'VerificationStatuses',
});

export type Did = string;

export interface IVcSchema {
  did: Did,
  schema: string
}

export interface IVcMessage {
  did: string;
  message: string;
}
export interface IIssueVcProperties {
  [key: string]: IIssueVcProperties
}

export enum AgentsRoles {
  issuer = 'ISSUER',
  holder = 'HOLDER',
  verifier = 'VERIFIER',
}

registerEnumType(AgentsRoles, {
  name: 'AgentsRoles',
});

@ObjectType()
export class EventLogEntry {
  @Field(type => Number)
  id: number;

  @Field(type => String)
  created: Date;

  @Field(type => String)
  owner: Did;

  @Field(type => String)
  message: string;
}

@ObjectType()
export class VerificationCase {
  @Field(type => String)
  verifierDid: Did;

  @Field(type => VerificationStatuses)
  status: VerificationStatuses
}

@ObjectType()
export class VC {
  @Field(type => String)
  vcDid: Did;

  @Field(type => String)
  vcTypeDid: Did;

  @Field(type => String)
  vcParams: string; // Serialized JSON key-value struct

  @Field(type => String)
  vcRawText: string; // Serialized JSON struct incl signatures, JWT

  @Field(type => String)
  issuerDid: Did;

  @Field(type => String)
  holderDid: Did;

  @Field(type => String)
  createdAt: string;

  @Field(type => String)
  updatedAt: string;

  @Field(type => [VerificationCase])
  verificationCases: Array<{
    verifierDid: Did,
    status: VerificationStatuses
  }>
}
