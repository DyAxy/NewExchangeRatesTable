import axios from "axios";

export default async function exec(
  currencies: CurrenciesJson
): Promise<ResultData> {
  try {
    const result: ResultData = {
      timestamp: Math.floor(Date.now() / 1000),
      data: {},
    };
    for (const currency in currencies) {
      if (currency === "USD") {
        result.data[currency] = 1;
        continue;
      }
      const endpoint = "https://neutrinoapi.net/convert";
      try {
        const { data } = await axios.get(endpoint, {
          headers: {
            "User-ID": Bun.env.NEUTRINO_USER_ID || "",
            "API-Key": Bun.env.NEUTRINO_API_KEY || "",
          },
          params: {
            "from-value": 1,
            "from-type ": "USD",
            "to-type ": currency,
          },
        });
        if (data && data.valid) {
          result.data[currency] = parseFloat(data.result);
        } else {
          result.data[currency] = -1;
        }
      } catch (error) {
        console.error(`获取 ${currency} 汇率失败`, error);
        result.data[currency] = -1;
      }
    }
    return result;
  } catch (error) {
    throw error;
  }
}
