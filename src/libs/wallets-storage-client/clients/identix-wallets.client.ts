import { gql, GraphQLClient } from 'graphql-request'
import {IWalletsStorageClient, WalletsVCData} from "@/libs/wallets-storage-client/types";
import {Did, VerificationStatuses} from "@/libs/vc-brokerage/types";
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

  async getUserVCs(userDid: Did): Promise<WalletsVCData[]> {
    const query = gql`
      query getUserVCs($userDid: String!) {  
        getUserVCs(userDid: $userDid) {
          vcDid,
          vcData,
          issuerDid,
          holderDid,
          verificationCases {
            verifierDid,
            verificationStatus
          }
        }
      }      
    `;

    const {getUserVCs: vcc} = await this.graphQLClient.request(query, { userDid });
    return vcc;
  }

  async getVC(vcDid: Did): Promise<WalletsVCData> {
    const query = gql`
      query getVC($vcDid: String!) {  
        getVC(vcDid: $vcDid) {
          vcDid,
          vcData,
          issuerDid,
          holderDid,
          verificationCases {
            verifierDid,
            verificationStatus
          }
        }
      }      
    `;

    const {getVC: vc} = await this.graphQLClient.request(query, { vcDid });
    return vc;
  }

  async requestVcVerification(vcDid: Did, verifierDid: Did): Promise<boolean> {
    const query = gql`
      mutation requestVcVerification(
          $vcDid: String!
          $verifierDid: String!
        ) {  
           requestVcVerification(
             vcDid: $vcDid,
             verifierDid: $verifierDid
          ) 
        }      
    `;

    await this.graphQLClient.request(query, {vcDid, verifierDid});

    return true;
  }

  async verifyVC(vcDid: Did, verifierDid: Did, verificationStatus: VerificationStatuses): Promise<boolean> {
    const query = gql`
      mutation verifyVc(
          $vcDid: String!
          $verifierDid: String!
          $verificationStatus: String!
        ) {  
           verifyVc(
             vcDid: $vcDid,
             verifierDid: $verifierDid,
             verificationStatus: $verificationStatus
          ) 
        }      
    `;

    await this.graphQLClient.request(query, {vcDid, verifierDid, verificationStatus});

    return true;
  }
}
