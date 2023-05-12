import {Field, Int, ObjectType} from "@nestjs/graphql";
import { registerEnumType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

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

export type TUserCreate = {
  did: string
  lastActive?: Date | null
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
}