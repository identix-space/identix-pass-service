import { gql, GraphQLClient } from 'graphql-request'
import {Did} from "@/libs/vc-brokerage/types";
import { Account, AccountSession } from '../types';

export class IdentixSSOClient {
  private graphQLClient: GraphQLClient;

  constructor(params: {clientToken: string, ssoGraphqlApiUrl: string}) {
    const {clientToken, ssoGraphqlApiUrl} = params;
    this.graphQLClient = new GraphQLClient(ssoGraphqlApiUrl, { headers: {'authorization-client': clientToken}});
  }

  async whoami(userSessionDid: Did): Promise<Account> {
    const query = gql`
      query whoami {  
        whoami {
          id
          createdAt
          updatedAt
          status
          roles
          avatarUrl
          sessions {
            id
            createdAt
            updatedAt
            accountId
            ipAddr
            expiresAt
          }
          did
          connections {
            id
            uid
            accountId
            createdAt
            updatedAt
            otherData
          }
        }
      }      
    `;

  const {whoami} = await this.graphQLClient.request(query, {}, {Authorization: userSessionDid});
    return whoami;
  }

  async logout(sessions: AccountSession[], token: Did): Promise<boolean> {
    const query = gql`
      mutation logout($sessionIds: [Float!]!){
        logout(sessionIds: $sessionIds)
      }    
    `;
    const sessionIds = sessions.reduce((ac, cV) => {
      ac.push(cV.id);
      return ac;
    }, []);

    const { logout } = await this.graphQLClient.request(query, { sessionIds }, { Authorization: token });
    return logout;
  }
}
