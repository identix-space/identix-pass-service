import {AgentsRoles, Did, VC, VerificationCase, VerificationStatuses} from "@/libs/vc-brokerage/types";
import {faker} from "@faker-js/faker";

export enum VCTypes {
  stateId = 'stateId',
  proofOfResidency = 'proofOfResidency'
}

export class VCHelper {
  public generateVC(role: AgentsRoles, userDid: Did, vcType: VCTypes): VC {
    const vcParams = this.generateVCParams(vcType);
    return {
      vcDid: this.generateRandomDid('vc'),
      vcTypeDid: this.generateRandomDid('vc-type'),
      vcParams: vcParams,
      vcRawText: this.generateVCRawText(vcType, vcParams),
      issuerDid: role === AgentsRoles.issuer ? userDid : this.generateRandomDid('user'),
      holderDid: role === AgentsRoles.issuer ? userDid : this.generateRandomDid('user'),
      verificationCases: this.generateVerificationCases(role, userDid),
      createdAt: new Date(),
      updatedAt: new Date()
    } as VC;
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
        dateOfBirth: (new Date(faker.date.past(faker.random.number({min: 10, max: 50})))).toISOString(),
        id: `${faker.random.alphaNumeric(4).toUpperCase()} ${faker.random.alphaNumeric(8).toUpperCase()}`,
        dateOfIssuance: (new Date(faker.date.recent(faker.random.number({min: 10, max: 50})))).toISOString(),
        dateOfExpire: (new Date(faker.date.future(faker.random.number({min: 1, max: 3})))).toISOString()
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

  private generateVCRawText(vcType: VCTypes, vcParams: string): string {
    return vcParams;
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
}
