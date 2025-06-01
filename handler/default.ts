import axios from "axios";

export default async function exec(
  currencies: CurrenciesJson
): Promise<ResultData> {
  try {
    const endpoint =
      "https://api.apilayer.com/exchangerates_data/latest?base=USD";

    const { data } = await axios.get(endpoint, {
      headers: {
        apikey: Bun.env.DEFAULT_API_KEY || "",
      },
    });
    const result: ResultData = {
      timestamp: data.timestamp,
      data: {},
    };
    for (const currency in currencies) {
      const value = data.rates[currency];
      if (value !== undefined) {
        result.data[currency] = value;
      } else {
        result.data[currency] = -1; // 如果没有找到对应的货币，设置为 -1
      }
    }
    return result;
  } catch (error) {
    throw error;
  }
}
