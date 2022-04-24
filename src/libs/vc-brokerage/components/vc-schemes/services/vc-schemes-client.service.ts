import {IVcScheme, IVcSchemesClient, IVcSearchParams} from "@/libs/vc-brokerage/components/vc-schemes/types";

export class VcSchemesClientService implements IVcSchemesClient {
  private readonly vcSchemesStorage: Set<IVcScheme>;

  constructor(vcSchemesStorage: Set<IVcScheme>) {
    this.vcSchemesStorage = vcSchemesStorage;
  }

  getSchemes(params?: IVcSearchParams|undefined): IVcScheme[] {
    const {did, key} = params || {};

    if (did && key) {
      return Array.from(this.vcSchemesStorage).filter(scheme => scheme.did === did && scheme.key === key);
    }

    if (did) {
      return Array.from(this.vcSchemesStorage).filter(scheme => scheme.did === did);
    }

    if (key) {
      return Array.from(this.vcSchemesStorage).filter(scheme => scheme.key === key);
    }

    return Array.from(this.vcSchemesStorage);
  }
}
