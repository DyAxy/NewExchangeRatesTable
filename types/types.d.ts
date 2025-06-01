interface CurrenciesJson {
  [key: string]: {
    icon: string;
    displayName: string;
    symbol: string;
  };
}
interface ResultData {
  timestamp: number;
  data: Record<string, number>;
}
interface WiseData {
  rate: number;
  source: string;
  target: string;
  time: string;
}
interface UnionPayData {
  transCur: string;
  baseCur: string;
  rateData: number;
}
