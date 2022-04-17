import {Injectable} from "@nestjs/common";
import {ISSOClientService} from "@/libs/sso-client/types";
import {Did} from "@/libs/vc-brokerage/types";

@Injectable()
export class SsoClientService implements ISSOClientService{
  public async registerSession(clientDid: Did): Promise<Did> {
    return;

  }
  public async validateUserSession(clientSessionDid: Did, userSessionDid: Did): Promise<Did> {
    return
  }
}