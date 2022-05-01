import { gql, GraphQLClient } from 'graphql-request'
import {IWalletsStorageClient} from "@/libs/wallets-storage-client/types";
import {Did, VCData} from "@/libs/vc-brokerage/types";
import {BaseStorageWalletsClient} from "@/libs/wallets-storage-client/clients/base-storage-wallets.client";
import {KeyValueType} from "@/libs/common/types";
import {faker} from "@faker-js/faker";

export class IdentixWalletsStorageClient extends BaseStorageWalletsClient implements IWalletsStorageClient {
  private graphQLClient: GraphQLClient;

  constructor(params: {walletsStorageUrl: string, walletsApiToken: string}) {
    super();
    const {walletsStorageUrl, walletsApiToken} = params;
    this.graphQLClient = new GraphQLClient(walletsStorageUrl, { headers: {Authorization: walletsApiToken}});
  }

  public async getOrCreateAccount(params: KeyValueType): Promise<Did[]> {
    return [`did:ever:user:${faker.random.alphaNumeric(30)}`];
  }

  public async createVC(vcDid: Did, issuerDid: Did, holderDid: Did, vcData: string): Promise<void> {
    const query = gql`
      mutation createVC(
          $vcDid: String!
          $vcData: String!
          $issuerDid: String!
          $holderDid: String!
        ) {  
           createVC(
             vcDid: $vcDid,
             vcData: $vcData,
             issuerDid: $issuerDid,
             holderDid: $holderDid 
          ) {
            id
          }
        }      
    `;

    await this.graphQLClient.request(query, {vcDid, issuerDid, holderDid, vcData});
  }

  public async readVC(did: string): Promise<VCData> {
    return;
  }

  public async  updateVC(did: string, vcData: VCData): Promise<void> {
    return;
  }

  public async  deleteVC(did: string): Promise<void> {
    return;
  }
}
