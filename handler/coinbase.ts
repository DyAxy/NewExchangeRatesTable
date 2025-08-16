import axios from "axios";

export default async function exec(
  currencies: CurrenciesJson
): Promise<ResultData> {
  try {
    const endpoint = "https://api.coinbase.com/v2/exchange-rates?currency=USD";
    const { data } = await axios.get(endpoint);
    const result: ResultData = {
      timestamp: Math.floor(Date.now() / 1000),
      data: {},
    };

    for (const currency in currencies) {
      if (currency === "USD") {
        result.data["USD"] = 1;
        continue;
      }

      const target = data.data.rates[currency];
      if (target) {
        result.data[currency] = parseFloat(target);
      } else {
        result.data[currency] = -1;
      }
    }
    return result;
  } catch (error) {
    throw error;
  }
}
