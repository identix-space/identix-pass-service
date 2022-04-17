import {Injectable} from "@nestjs/common";
import {ISSOClientService} from "@/libs/sso-client/types";
import {Did} from "@/libs/vc-brokerage/types";
import {faker} from "@faker-js/faker";
import {SsoService} from "identix-sso-client-js";

@Injectable()
export class SsoClientService implements ISSOClientService{
  private readonly ssoService;

  constructor() {
    const ssoGraphqlApiUrl = process.env.SSO_GRAPHQL_API_URL;
    if (!ssoGraphqlApiUrl) {
      throw new Error("SSO Client configuration error: GraphQL API URL is undefined");
    }
    this.ssoService = new SsoService(ssoGraphqlApiUrl)
  }

  public async registerSession(clientDid: Did): Promise<Did> {
    // const otcDid = await ssoService.requestClientLogin(clientDid)
    // const signedOtcDid = 'signed_' + otcDid;
    // const sessionTokenDid = await ssoService.attemptClientLogin(clientDid, signedOtcDid);

    const sessionTokenDid = faker.random.alphaNumeric(30);
    return sessionTokenDid;

  }
  public async validateUserSession(clientSessionDid: Did, userSessionDid: Did): Promise<Did> {
    //const userDid = await ssoService.validateUserSession(clientSessionDid, userSessionDid);

    const userDid = faker.random.alphaNumeric(30);
    return userDid;
  }
}