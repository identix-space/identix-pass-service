export interface VCData {
  [key: string]: string | number | boolean | VCData | VCData[] | null;
}

export type Did = string;
export interface IVcSchema {
  did: Did,
  schema: string
}

export interface IVcMessage {
  did: string;
  message: string;
}
export interface IIssueVcProperties {
  [key: string]: IIssueVcProperties
}