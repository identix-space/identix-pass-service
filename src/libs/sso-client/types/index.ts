import {Did} from "@/libs/vc-brokerage/types";
import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { registerEnumType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

export const SSOClient = 'SSO_CLIENT_PROVIDER';

export enum AccountRole {
    ADMIN = "ADMIN",
    USER = "USER"
}
registerEnumType(AccountRole, { name: 'AccountRole', description: undefined });

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED"
}
registerEnumType(AccountStatus, { name: 'AccountStatus', description: undefined });

export interface ISSOClient {
  validateUserSession(userSessionDid: Did): Promise<Account>; // returns client Did or throw exception
  logout(userSessionDid: Did): Promise<boolean>;
}

export interface ISSOClientService {
  registerSession(clientDid: Did): Promise<Did>; // returns session Did
  validateUserSession(clientSessionDid: Did, userSessionDid: Did): Promise<Account>; // returns client Did or throw exception
}

export type SSOClientConfiguration = {
  clientToken: string;
  ssoGraphqlApiUrl: string;
}

export interface ISsoNpmService {
  requestClientLogin: (clientDid: Did) => Promise<Did>;
  attemptClientLogin: (clientDid: Did, signedOtcDid: Did) => Promise<Did>;
  validateUserSession: (clientSessionDid: Did, userSessionDid: Did) => Promise<Did>;
}

@ObjectType()
export class Account {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => [AccountRole], {nullable:true})
    roles!: Array<keyof typeof AccountRole>;

    @Field(() => AccountStatus, {nullable:false})
    status!: keyof typeof AccountStatus;

    @Field(() => String, {nullable:true})
    avatarUrl!: string | null;

    @Field(() => String, {nullable:false})
    did!: string;

    @Field(() => [AccountSession], {nullable:true})
    sessions?: Array<AccountSession>;

    @Field(() => [OAuthConnection], {nullable:true})
    connections?: Array<OAuthConnection>;
}

@ObjectType()
export class AccountSession {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => Int, {nullable:false})
    accountId!: number;

    @Field(() => String, {nullable:false})
    ipAddr!: string;

    @Field(() => String, {nullable:true})
    userAgent!: string | null;

    @Field(() => Date, {nullable:false})
    expiresAt!: Date;

    @Field(() => Account, {nullable:false})
    account?: Account;
}

@ObjectType()
export class OAuthConnection {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => Int, {nullable:false})
    accountId!: number;

    @Field(() => String, {nullable:false})
    uid!: string;

    @Field(() => GraphQLJSON, {nullable:false})
    otherData!: any;

    @Field(() => Account, {nullable:false})
    account?: Account;
}
