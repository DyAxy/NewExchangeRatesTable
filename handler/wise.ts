import axios from "axios";

export default async function exec(
  currencies: CurrenciesJson
): Promise<ResultData> {
  try {
    const endpoint = "https://api.wise.com/v1/rates?source=USD";
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Basic ${Bun.env.WISE_API_KEY || ""}`,
      },
    });
    const result: ResultData = {
      timestamp: Math.floor(Date.now() / 1000),
      data: {},
    };

    for (const currency in currencies) {
      if (currency === "USD") {
        result.data["USD"] = 1;
        continue;
      }
      
      const target = data.find((item: WiseData) => item.target === currency);
      if (target) {
        result.data[currency] = target.rate;
      } else {
        result.data[currency] = -1;
      }
    }
    return result;
  } catch (error) {
    throw error;
  }
}
