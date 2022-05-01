import {AgentsRoles, Did, VC, VerificationCase, VerificationStatuses} from "@/libs/vc-brokerage/types";
import {faker} from "@faker-js/faker";
import {KeyValueType} from "@/libs/common/types";

export enum VCTypes {
  stateId = 'stateId',
  proofOfResidency = 'proofOfResidency'
}

export class VCHelper {
  private vcTypesDids: Map<VCTypes, string> = new Map<VCTypes, string>();

  constructor() {
    this.vcTypesDids.set(VCTypes.stateId, this.generateRandomDid('ever:schema'));
    this.vcTypesDids.set(VCTypes.proofOfResidency, this.generateRandomDid('ever:schema'));
  }

  public generateVC(role: AgentsRoles, userDid: Did, vcType: VCTypes): VC {
    const vcParams = this.generateVCParams(vcType);

    const vcObj = {
      vcDid: this.generateRandomDid('ever:vc'),
      vcTypeDid: this.vcTypesDids.get(vcType),
      vcParams: vcParams,
      issuerDid: role === AgentsRoles.issuer ? userDid : this.generateRandomDid('ever:user'),
      holderDid: role === AgentsRoles.holder ? userDid : this.generateRandomDid('ever:user'),
      verificationCases: this.generateVerificationCases(role, userDid),
      createdAt: (new Date()).toISOString(),
      updatedAt: (new Date()).toISOString()
    };

    const vc = {} as VC;
    vc.vcDid = vcObj.vcDid;
    vc.vcTypeDid = vcObj.vcTypeDid;
    vc.issuerDid = vcObj.issuerDid;
    vc.holderDid = vcObj.holderDid;
    vc.verificationCases = vcObj.verificationCases;
    vc.createdAt = vcObj.createdAt;
    vc.updatedAt = vcObj.updatedAt;
    vc.vcRawText = this.generateVCRawText(vcObj);
    vc.vcParams = JSON.stringify(vcParams);

    return vc;
  }

  private generateRandomDid(description: string): Did {
    return `did:${description}:${faker.random.alphaNumeric(30)}`;
  }

  private generateVCParams(vcType: VCTypes): KeyValueType {
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
    return vcParams;
  }

  private generateVCRawText(vcObject: KeyValueType): string {
    return JSON.stringify(vcObject);
  }

  private generateVerificationCases(role: AgentsRoles, userDid: Did): VerificationCase[] {
    const verificationStatuses = [
      VerificationStatuses.rejected,
      VerificationStatuses.approved,
      VerificationStatuses.pendingApproval
    ];

    const randomLengthArray = [];
    let index = 0;
    const arrayLength = Math.floor(Math.random() * 3) + 1;
    while (index < arrayLength) {
      randomLengthArray.push(index);
      index++;
    }

    const verificationCases = randomLengthArray.map(() => ({
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
