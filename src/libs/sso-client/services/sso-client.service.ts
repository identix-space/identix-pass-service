import {Injectable} from "@nestjs/common";
import {ISSOClientService, ISsoNpmService} from "@/libs/sso-client/types";
import {Did} from "@/libs/vc-brokerage/types";
import {SsoService} from "identix-sso-client-js";
import {faker} from "@faker-js/faker";

@Injectable()
export class SsoClientService implements ISSOClientService{
  private ssoService: SsoService;
  private didSessionsStorage: Map<Did, {did: Did, createdAt: Date}>
    = new Map<Did, {did: Did, createdAt: Date}>();
  private expiringDurationInSec: number = 24 * 3600; //24 hours

  init(ssoService: SsoService): void {
    this.ssoService = ssoService;
  }

  public async registerSession(clientDid: Did): Promise<Did> {
    // const otcDid = await this.ssoService.requestClientLogin(clientDid)
    // const signedOtcDid = 'signed_' + otcDid;
    // const sessionTokenDid = await this.ssoService.attemptClientLogin(clientDid, signedOtcDid);

    const sessionTokenDid = `did:identix-session:${faker.random.alphaNumeric(30)}`;
    return sessionTokenDid;

  }

  public async validateUserSession(clientSessionDid: Did, userSessionDid: Did): Promise<Did> {
    if (this.didSessionsStorage.has(userSessionDid)) {
      const session = this.didSessionsStorage.get(userSessionDid);
      const sessionCreatedAt = session.createdAt;
      if (sessionCreatedAt.getTime() + this.expiringDurationInSec * 1000 > (new Date()).getTime()) {
        return session.did;
      }

      this.didSessionsStorage.delete(userSessionDid);
    }

    //const userDid = await this.ssoService.validateUserSession(clientSessionDid, userSessionDid);
    const userDid = `did:identix-user:${faker.random.alphaNumeric(30)}`;

    this.didSessionsStorage.set(userSessionDid, {did: userDid, createdAt: new Date()})

    return userDid;
  }
}
