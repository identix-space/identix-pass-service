import {Injectable, UnauthorizedException} from "@nestjs/common";
import {Account, ISSOClientService} from "@/libs/sso-client/types";
import {IdentixSSOClient} from "@/libs/sso-client/clients/identix-sso.client"
import {Did} from "@/libs/vc-brokerage/types";
import {faker} from "@faker-js/faker";

@Injectable()
export class SsoClientService implements ISSOClientService{
  private ssoService: IdentixSSOClient;
  private didSessionsStorage: Map<Did, {user: Account, createdAt: Date}>
    = new Map<Did, {user: Account, createdAt: Date}>();
  private expiringDurationInSec: number = 24 * 3600; //24 hours

  init(ssoService: IdentixSSOClient): void {
    this.ssoService = ssoService;
  }

  public async registerSession(clientDid: Did): Promise<Did> {
    const sessionTokenDid = `did:ever:session:${faker.random.alphaNumeric(30)}`;
    return sessionTokenDid;
  }

  public async logout(userSessionDid: Did): Promise<boolean> {
    console.log(userSessionDid);
    console.log(this.didSessionsStorage);
    const { user } = this.didSessionsStorage.get(userSessionDid);
    this.didSessionsStorage.delete(userSessionDid);
    return await this.ssoService.logout(user.sessions, userSessionDid);
  }

  public async validateUserSession(clientSessionDid: Did, userSessionDid: Did): Promise<Account> {
    if (this.didSessionsStorage.has(userSessionDid)) {
      const session = this.didSessionsStorage.get(userSessionDid);
      const sessionCreatedAt = session.createdAt;
      if (sessionCreatedAt.getTime() + this.expiringDurationInSec * 1000 > (new Date()).getTime()) {
        return session.user;
      }

      this.didSessionsStorage.delete(userSessionDid);
    }

    let user;
    try {
      user = await this.ssoService.whoami(userSessionDid);
    } catch (e) {
      throw e;
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    this.didSessionsStorage.set(userSessionDid, {user, createdAt: new Date()})

    return user;
  }
}
