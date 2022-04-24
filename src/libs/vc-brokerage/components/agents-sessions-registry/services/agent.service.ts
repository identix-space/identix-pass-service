// import { Injectable } from '@nestjs/common';
//
// import {IVcVault, IVCVaultFactory} from '@/libs/vc-brokerage/components/wallets-storage-client/types'
// @Injectable()
// export class AgentService {
//   constructor(
//     private vaultFactory?: IVCVaultFactory,
//     private brokersFactory?: IVcBrokerComponent;
//     private _msg?: IVcMessageDb;
//     private _issuerSchemes?: VcScheme[];
//   ) {
//
//   }
// }

import {IMessagingClient} from "@/libs/messaging/types";
import {IVcBroker} from "@/libs/vc-brokerage/components/vc-brokers/types";
import {IVcSchemesClient} from "@/libs/vc-brokerage/components/vc-schemes/types";

export class AgentService {
  constructor(
    private messagingClient: IMessagingClient,
    private vcBroker: IVcBroker,
    private vcSchemes: IVcSchemesClient
  ) {}
}
