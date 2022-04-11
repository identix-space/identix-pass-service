export interface VCData {
  [key: string]: string | number | boolean | VCData | VCData[] | null;
}