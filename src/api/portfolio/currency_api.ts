import axios, { AxiosResponse } from "axios";
import { api_portfolio_currency_list } from "../../links/api_links";
import { stringIsEmpty } from "../../utils/string";

export class CurrencyListData {
  currency_tags: string[] = [];
  error: string = "";

  hasError(): boolean {
      return (!stringIsEmpty(this.error));
  }

  isSuccess(): boolean {
      return !this.hasError();
  }

  cleanErrors() {
      this.error = "";
  }
}

export async function currency_list(token: string, currencyListData: CurrencyListData) {
  currencyListData.cleanErrors();
  const response: AxiosResponse = 
  await axios({
      method: "get",
      url: api_portfolio_currency_list, 
      headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Token ${token}` 
      },
  }).catch((err) => err.response);
  
  if (response == null) {
    currencyListData.error = 'Unknown Error';
  } else {
    const { data: postResponseData }: any = response;
    if (postResponseData == null) {
      return 'Unknown Error';
    } else {
      const { title, }: any = postResponseData;
      if (response.status === 200) {
          const {data}: any = postResponseData;
          if (data == null) {
            return 'Unknown Error';
          } else {
            currencyListData.currency_tags = [];
            for (const rawTag of data) {
              try {
                const cur_tag = String(rawTag ?? "")
                if (cur_tag.length > 1) currencyListData.currency_tags.push(cur_tag);
              } catch { /* skip */ }
            }
          }
      } else {
        currencyListData.error = title ?? 'Unknown Error';
      }
    }
  }
}
