import {AgentsRoles, Did, VC, VerificationCase, VerificationStatuses} from "@/libs/vc-brokerage/types";
import {faker} from "@faker-js/faker";

export enum VCTypes {
  stateId = 'stateId',
  proofOfResidency = 'proofOfResidency'
}

export class VCHelper {
  private vcTypesDids: Map<VCTypes, string> = new Map<VCTypes, string>();

  constructor() {
    this.vcTypesDids.set(VCTypes.stateId, this.generateRandomDid('vc-type:state-id'));
    this.vcTypesDids.set(VCTypes.proofOfResidency, this.generateRandomDid('vc-type:proof-of-residency'));
  }

  public generateVC(role: AgentsRoles, userDid: Did, vcType: VCTypes): VC {
    const vcParams = this.generateVCParams(vcType);
    const vc = {
      vcDid: this.generateRandomDid('vc'),
      vcTypeDid: this.vcTypesDids.get(vcType),
      vcParams: vcParams,
      issuerDid: role === AgentsRoles.issuer ? userDid : this.generateRandomDid('user'),
      holderDid: role === AgentsRoles.issuer ? userDid : this.generateRandomDid('user'),
      verificationCases: this.generateVerificationCases(role, userDid),
      createdAt: (new Date()).toISOString(),
      updatedAt: (new Date()).toISOString()
    } as VC;

    vc.vcRawText = this.generateVCRawText(vc);

    return vc;
  }

  private generateRandomDid(description: string): Did {
    return `did:${description}:${faker.random.alphaNumeric(30)}`;
  }

  private generateVCParams(vcType: VCTypes): string {
    let vcParams
    if (vcType === VCTypes.stateId) {
      vcParams = {
        name: faker.name.firstName(),
        lastName: faker.name.lastName(),
        citizenship: faker.address.country(),
        dateOfBirth: this.shortISODataFormat(new Date(faker.date.past(faker.random.number({min: 10, max: 50})))),
        id: `${faker.random.alphaNumeric(4).toUpperCase()} ${faker.random.alphaNumeric(8).toUpperCase()}`,
        dateOfIssuance: this.shortISODataFormat(new Date(faker.date.recent(faker.random.number({min: 10, max: 50})))),
        dateOfExpire: this.shortISODataFormat(new Date(faker.date.future(faker.random.number({min: 1, max: 3}))))
      }
    } else { //  if (vcType === VCTypes.proofOfResidency)
      vcParams = {
        country: faker.address.country(),
        city: faker.address.city(),
        zipCode: faker.random.number({min: 10000, max: 100000}),
        address: faker.address.streetAddress(),
        house: faker.random.number({min: 1, max: 100})
      }
    }
    return JSON.stringify(vcParams);
  }

  private generateVCRawText(vcObject: VC): string {
    return JSON.stringify(vcObject);
  }

  private generateVerificationCases(role: AgentsRoles, userDid: Did): VerificationCase[] {
    const verificationStatuses = [
      VerificationStatuses.rejected,
      VerificationStatuses.approved,
      VerificationStatuses.pendingApproval
    ];

    const verificationCases = [1, 2, 3].map(() => ({
      verifierDid: this.generateRandomDid('user'),
      status: verificationStatuses[faker.random.number({min: 0, max: 2})]
    }));

    if (role === AgentsRoles.verifier) {
      verificationCases.push({
        verifierDid: userDid,
        status: verificationStatuses[faker.random.number({min: 0, max: 2})]
      })
    }

    return verificationCases;
  }

  private shortISODataFormat(date: Date): string {
    return date.toISOString().split('T').shift();
  }
}
