import {Did} from "@/libs/vc-brokerage/types";
import {IVcBroker} from "@/libs/vc-brokerage/components/vc-brokers/types";
import {IMessagingClient} from "@/libs/messaging/types";

export class SimpleBrokerService implements IVcBroker{
  constructor(messagingClient: IMessagingClient) {}

  async connect (party: Did): Promise<Did>  {
    return;
  }

  async issueVc(session: Did): Promise<Did> {
    return;
  }
}
