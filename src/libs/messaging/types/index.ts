export const MessagingClient = 'MESSAGING_CLIENT';

export enum MessagesStatuses {
  unprocessed = 'UNPROCESSED',
  processed = 'PROCESSED'
}

export interface IMessagingClient {
  publish: (queue: string, message: string) => Promise<string>; // returns message uuid
  subscribe: (queue: string, handler: (message: string) => Promise<void>) => Promise<string>; //returns subscriber uuid
  unsubscribe: (uuid: string) => Promise<void>; //gets uuid subscriber
  getLastMessages: (queue: string, count: number, status?: MessagesStatuses) => Promise<Map<string, string>>; // returns Map<message uuid, message>
  setMessageStatus: (uuid: string, status: MessagesStatuses) => Promise<void>;
}
