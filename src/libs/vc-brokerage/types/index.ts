import {Field, InputType, ObjectType} from "@nestjs/graphql";

export interface VCData {
  [key: string]: string | number | boolean | VCData | VCData[] | null;
}

export enum VerificationStatuses {
  pending = 'PENDING',
  accepted = 'ACCEPTED',
  rejected = 'REJECTED'
}

@ObjectType()
export class VC {
  @Field(type => String)
  did: Did;

  @Field(type => String)
  issuer: Did;

  @Field(type => String, { nullable: true })
  holder?: Did;

  @Field(type => String, { nullable: true })
  verifier?: Did;

  @Field(type => String)
  data: string;
}

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
  Issuer = 'ISSUER',
  Holder = 'HOLDER',
  Verifier = 'VERIFIER',
}
