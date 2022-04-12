export interface VCData {
  [key: string]: string | number | boolean | VCData | VCData[] | null;
}

export type Did = string;
export interface IVcSchema {
  did: Did,
  schema: string
}