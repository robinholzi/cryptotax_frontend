import axios, { AxiosResponse } from "axios";
import { api_portfolio_create_orders, api_portfolio_create_deposits, api_portfolio_create_transfers } from "../../links/api_links";
import { ParsedDeposit } from "../../model/txs/deposit";
import { ParsedOrder } from "../../model/txs/order";
import { ParsedTransfer } from "../../model/txs/transfer";


export const portfolio_insert_orders = async (token: string, pid: number, orders: ParsedOrder[]) => {
  let req_body = []
  try {
    for (let order of orders) {
      req_body.push({
        "datetime": order.datetime.toISOString(),
        "exchange_wallet": order.exchange_wallet,
        "fee": order.fee,
        "fee_currency": order.fee_currency,

        "from_currency": order.from_currency,
        "to_currency": order.to_currency,
        "from_amount": order.from_amount,
        "to_amount": order.to_amount,
      });
    }

    const response: AxiosResponse = 
    await axios({
        method: "post",
        url: api_portfolio_create_orders(pid), 
        headers: { 
            "Content-Type": "multipart/form-data",
            "Authorization": `Token ${token}` 
        },
        data: JSON.stringify(req_body)
    }).catch((err) => err);
    
    if (response == null) {
      return 'Unknown Error';
    } else {
      const { data: postResponseData }: any = response;
      if (postResponseData == null) {
        return 'Unknown Error';
      } else {
        const { title, message, }: any = postResponseData;
        if (response.status === 200) {
          return "success";
        } else {
          return message ?? (title ?? 'Unknown Error');
        }
      }
    }

  } catch (exception) {
    return 'Unknown client-side exception occured!';
  }
}

export const portfolio_insert_deposits = async (token: string, pid: number, deposits: ParsedDeposit[]) => {
  let req_body = []
  try {
    for (let deposit of deposits) {
      req_body.push({
        "datetime": deposit.datetime.toISOString(),
        "exchange_wallet": deposit.exchange_wallet,
        "fee": deposit.fee,
        "fee_currency": deposit.fee_currency,

        "type": deposit.type,
        "buy_datetime": deposit.buy_datetime,
        "amount": deposit.amount,
        "currency": deposit.currency,                
        "taxable": deposit.taxable,
      });
    }

    const response: AxiosResponse = 
    await axios({
        method: "post",
        url: api_portfolio_create_deposits(pid), 
        headers: { 
            "Content-Type": "multipart/form-data",
            "Authorization": `Token ${token}` 
        },
        data: JSON.stringify(req_body)
    }).catch((err) => err);
    
    if (response == null) {
      return 'Unknown Error';
    } else {
      const { data: postResponseData }: any = response;
      if (postResponseData == null) {
        return 'Unknown Error';
      } else {
        const { title, message, }: any = postResponseData;
        if (response.status === 200) {
          return "success";
        } else {
          return message ?? (title ?? 'Unknown Error');
        }
      }
    }

  } catch (exception) {
    console.log("Unknown client-side exception occured!")
    return 'Unknown client-side exception occured!';
  }
}

export const portfolio_insert_transfers = async (token: string, pid: number, transfers: ParsedTransfer[]) => {
  let req_body = []
  for (let transfer of transfers) {
    req_body.push({
      "datetime": transfer.datetime.toISOString(),
      "exchange_wallet": transfer.exchange_wallet,
      "fee": transfer.fee,
      "fee_currency": transfer.fee_currency,

      "from_exchange_wallet": transfer.from_exchange_wallet,
      "amount": transfer.amount,
      "currency": transfer.currency
    });
  }

  try {
    const response: AxiosResponse = 
    await axios({
        method: "post",
        url: api_portfolio_create_transfers(pid), 
        headers: { 
            "Content-Type": "multipart/form-data",
            "Authorization": `Token ${token}` 
        },
        data: JSON.stringify(req_body)
    }).catch((err) => err);
    
    if (response == null) {
      return 'Unknown Error';
    } else {
      const { data: postResponseData }: any = response;
      if (postResponseData == null) {
        return 'Unknown Error';
      } else {
        const { title, message, }: any = postResponseData;
        if (response.status === 200) {
          return "success";
        } else {
          return message ?? (title ?? 'Unknown Error');
        }
      }
    }

  } catch (exception) {
    return 'Unknown client-side exception occured!';
  }
}
