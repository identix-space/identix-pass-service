import {Did} from "@/libs/vc-brokerage/types";

export const SSOClient = 'SSO_CLIENT_PROVIDER';

export interface ISSOClient {
  validateUserSession(userSessionDid: Did): Promise<Did>; // returns client Did or throw exception
}

export interface ISSOClientService {
  registerSession(clientDid: Did): Promise<Did>; // returns session Did
  validateUserSession(clientSessionDid: Did, userSessionDid: Did): Promise<Did>; // returns client Did or throw exception
}

export type SSOClientConfiguration = {
  pathToClientDid: string;
}