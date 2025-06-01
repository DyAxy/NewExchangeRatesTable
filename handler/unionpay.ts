import axios from "axios";

export default async function exec(
  currencies: CurrenciesJson
): Promise<ResultData> {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();
  const dateString = `${year}${month}${day}`;
  const result: ResultData = {
    timestamp: Math.floor(Date.now() / 1000),
    data: {},
  };

  const endpoint = "https://www.unionpayintl.com/upload/jfimg/";
  try {
    const { data } = await axios.get(endpoint + `${dateString}.json`);
    for (const currency in currencies) {
      if (currency === "USD") {
        result.data[currency] = 1;
        continue;
      }

      const target = data.exchangeRateJson.find(
        (item: UnionPayData) =>
          item.transCur === currency && item.baseCur === "USD"
      );
      if (target) {
        result.data[currency] = 1 / target.rateData;
      } else {
        result.data[currency] = -1;
      }
    }
    return result;
  } catch (error) {
    throw error;
  }
}
