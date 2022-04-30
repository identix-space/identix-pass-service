import {IMessagingClient} from "@/libs/messaging/types";
import {IVcBroker} from "@/libs/vc-brokerage/components/vc-brokers/types";
import {IVcSchemesClient} from "@/libs/vc-brokerage/components/vc-schemes/types";
import {IWalletsStorageClient} from "@/libs/wallets-storage-client/types";

export class AgentService {
  constructor(
    private messagingClient: IMessagingClient,
    private vcBroker: IVcBroker,
    private vcSchemes: IVcSchemesClient,
    private walletsStorageClient: IWalletsStorageClient
  ) {}
}
