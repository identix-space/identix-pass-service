import { gql, GraphQLClient } from 'graphql-request'
import {IWalletsStorageClient, WalletsVCData, ClaimsGroup} from "@/libs/wallets-storage-client/types";
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

  public async issueVC(id: number): Promise<string> {
    const query = gql`
      mutation issueVC(
          $id: Int!
        ) {  
          issueVC(
            id: $id
          )
        }      
    `;

    const data = await this.graphQLClient.request(query, {id});
    return data;
  }

  public async getOrCreateAccount(params: KeyValueType): Promise<Did[]> {
    return [`did:ever:user:${faker.random.alphaNumeric(30)}`];
  }

  public async saveVC(vcDid: Did, issuerDid: Did, holderDid: Did, vcData: string, vcSecret: string): Promise<number> {
    const query = gql`
      mutation saveVC(
          $vcDid: String!
          $vcData: String!
          $issuerDid: String!
          $holderDid: String!
          $vcSecret: String!
        ) {  
           saveVC(
             vcDid: $vcDid,
             vcData: $vcData,
             issuerDid: $issuerDid,
             holderDid: $holderDid,
             vcSecret: $vcSecret 
          ) {
            id
          }
        }      
    `;

    const {id} = await this.graphQLClient.request(query, {vcDid, issuerDid, holderDid, vcData, vcSecret});
    
    return id;
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

  async generateVcDid(): Promise<{vcDid: Did, vcSecret: string}> {
    return;
  }

  async sign(userDid: Did, message: string): Promise<{signed: string, signature: string}> {
    const query = gql`
      mutation signMessage(
          $accountDid: String!
          $message: String!
        ) {  
           signMessage(
             accountDid: $accountDid,
             message: $message
          ) {
            signed,
            signature
          }
        }      
    `;

    const { signMessage } = await this.graphQLClient.request(query, {accountDid: userDid, message});
    return { ...signMessage };
  }
}
