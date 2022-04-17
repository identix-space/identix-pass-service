import { ConfigService } from '@nestjs/config';

import { ReadStream, createReadStream, existsSync, mkdir, readFile, writeFile } from 'fs';
import { promisify } from 'util';

import {SSOClient, ISSOClient, SSOClientConfiguration} from "@/libs/sso-client/types";
import {LoggingService} from "@/libs/logging/services/logging.service";
import {Did} from "@/libs/vc-brokerage/types";
import {SsoClientService} from "@/libs/sso-client/services/sso-client.service";

const readFileAsync = promisify(readFile);

export const SSOClientProvider = {
  provide: SSOClient,
  useFactory: (
    config: ConfigService,
    logger: LoggingService,
    ssoClientService: SsoClientService
  ): Promise<ISSOClient> => ssoClientFactory(config, logger, ssoClientService),
  inject: [
    ConfigService,
    LoggingService,
    SsoClientService
  ],
};

async function  ssoClientFactory(
  config: ConfigService,
  logger: LoggingService,
  ssoClientService: SsoClientService
): Promise<ISSOClient> {
  const ssoClientConfig = config.get<SSOClientConfiguration>('sso-client-configuration');
  if (!ssoClientConfig || !ssoClientConfig.pathToClientDid) {
    throw new Error(`SSO Client configuration is invalid!`);
  }
  const  fullClientDifPath = `${process.cwd()}/${ssoClientConfig.pathToClientDid}`;

  if (!existsSync(fullClientDifPath)) {
    throw new Error(`SSO Client configuration is invalid: client Did path is incorrect!`);
  }

  const clientDidJson = await readFileAsync(fullClientDifPath);
  let clientDid = null;
  try {
    clientDid = JSON.parse(clientDidJson.toString());
  } catch (e) {
    throw new Error(`SSO Client Did is invalid: ${e.message}`);
  }

  let clientSessionDid = null;
  try {
    clientSessionDid = await ssoClientService.registerSession(clientDid);
  } catch (e) {
    throw new Error(`SSO Client Did is invalid. Impossible to get session Did: ${e.message}`);
  }

  return {
    validateUserSession: async (userSessionDid: Did): Promise<Did> => {
      return ssoClientService.validateUserSession(clientSessionDid, userSessionDid);
    }
  }
}