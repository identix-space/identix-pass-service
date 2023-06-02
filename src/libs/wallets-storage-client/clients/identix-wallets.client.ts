import { gql, GraphQLClient } from 'graphql-request'
import {IWalletsStorageClient, WalletsVCData} from "@/libs/wallets-storage-client/types";
import {Did, VC, VerificationStatuses} from "@/libs/vc-brokerage/types";
import {BaseStorageWalletsClient} from "@/libs/wallets-storage-client/clients/base-storage-wallets.client";
import {KeyValueType} from "@/libs/common/types";
import {faker} from "@faker-js/faker";
import {ClaimsGroup} from "@/libs/vc-brokerage/components/vc-brokers/types";

export class IdentixWalletsStorageClient extends BaseStorageWalletsClient implements IWalletsStorageClient {
  private graphQLClient: GraphQLClient;

  constructor(params: {walletsStorageUrl: string, walletsApiToken: string}) {
    super();
    const {walletsStorageUrl, walletsApiToken} = params;
    this.graphQLClient = new GraphQLClient(walletsStorageUrl, { headers: {Authorization: walletsApiToken}});
  }

  public async issueVC(claimsGroup: ClaimsGroup[], issuerDid: Did): Promise<string> {
    const query = gql`
      mutation issueVC(
          $claimsGroup: [ClaimsGroup!]!,
          $issuerDid: String!
        ) {  
          issueVC(
            claimsGroup: $claimsGroup,
            issuerDid: $issuerDid
          )
        }      
    `;

    const {issueVC} = await this.graphQLClient.request(query, {claimsGroup, issuerDid});
    return issueVC;
  }

  public async getOrCreateAccount(params: KeyValueType): Promise<Did[]> {
    return [`did:venom:user:${faker.random.alphaNumeric(30)}`];
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

    const {saveVC} = await this.graphQLClient.request(query, {vcDid, issuerDid, holderDid, vcData, vcSecret});
    
    return saveVC.id;
  }

  async getUserVCs(userDid: Did, vcType: string): Promise<WalletsVCData[]> {
    const query = gql`
      query getUserVCs($userDid: String!, $vcType: String) {  
        getUserVCs(userDid: $userDid, vcType: $vcType) {
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

    const {getUserVCs: vcc} = await this.graphQLClient.request(query, { userDid, vcType });
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

  async verifyVC(userDid: Did, titledid: string): Promise<VC> {
    const query = gql`
      mutation verifyVc(
          $userDid: String!
          $titledid: String!
        ) {  
           verifyVc(
            userDid: $userDid,
            titledid: $titledid
          ) {
            vcDid,
            vcData,
            issuerDid,
            holderDid
          }
        }      
    `;

    const {verifyVc} = await this.graphQLClient.request(query, {userDid, titledid});

    return verifyVc;
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
