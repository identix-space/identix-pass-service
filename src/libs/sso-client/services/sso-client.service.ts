import {Injectable} from "@nestjs/common";

type SessionData = {
  did: string;
}

@Injectable()
export class SsoClientService {
  constructor() {}

  public async  getToken(did: string, secret: string): Promise<string> {
    return 'token';
  }

  public async authenticate(token: string): Promise<SessionData> {
    return {did: 'test:did:12345'};
  }
}