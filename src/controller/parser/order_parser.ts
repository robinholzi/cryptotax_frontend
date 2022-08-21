// import { parse } from "fast-csv";
import { parse } from 'csv-parse/lib/sync';
import { ParsedOrder } from "../../model/txs/order";
import { InvalidCsvInputError } from './errors';
import { cvt_amount_from_str, cvt_currency_from_amount_str } from './utils';

// TODO: documentation -> if currency tag starts with number -> <AMOUNT><SPACE><TAG>
// TODO: documentation -> pair <TARGET_TAG>(" " | "/" | "|" | "\")<FOR_TAG>


// extract (cur1, cur2) from merged string
function parse_order_pair(str: string): Record<string, string> {
  // fail if nothing found
  const splitted = str.split(/[\s\\,/|]+/);
  if (splitted.length !== 2 
    || splitted[0].replaceAll(/[\s,\t]+/g, "").length < 1 
    || splitted[1].replaceAll(/[\s,\t]+/g, "").length < 1) {
    throw new InvalidCsvInputError("The currency pair >" + str + "< could not have been split into two currencies. Separator missing?");
  }
  return {
    first: splitted[0].replaceAll(/[\s,\t]+/g, ""), 
    second: splitted[1].replaceAll(/[\s,\t]+/g, "")
  };
}

export function parseOrders(csv_string: string): ParsedOrder[] {
  var orderList: ParsedOrder[] = [];
  const records = parse(csv_string, {delimiter: ','});
  
  for (let i=1; i<records.length; i++) {
    let rec = records[i];
    try {
      // copy column content
      const raw_date = String(rec[0] ?? "");
      const raw_exchange_wallet = String(rec[1] ?? "");
      const raw_pair = String(rec[2] ?? "");
      const raw_direction = String(rec[3] ?? "");
      const raw_target_amount = String(rec[4] ?? "");
      const raw_base_amount = String(rec[5] ?? "");
      const raw_fee = String(rec[6] ?? "");
      // const raw_remark = String(rec[7] ?? "");
      // ---

      const date = new Date(raw_date.endsWith("Z") ? raw_date : (raw_date + "Z"));
      
      let buy: boolean;
      if (raw_direction.toLowerCase() === "buy") {
        buy = true;
      } else if (raw_direction.toLowerCase() === "sell") {
        buy = false;
      } else {
        throw new InvalidCsvInputError("The order direction must either be 'BUY' or 'SELL' (case-insensitive)!");
      }
      
      let {first: currency_target, second: currency_base} = parse_order_pair(raw_pair);

      let amount_target = cvt_amount_from_str(raw_target_amount)
      let amount_base = cvt_amount_from_str(raw_base_amount)

      let fee: number = cvt_amount_from_str(raw_fee)
      let fee_currency: string = cvt_currency_from_amount_str(raw_fee, currency_base ?? "EUR")

      let order = new ParsedOrder(
        date, raw_exchange_wallet,
        fee, fee_currency,

        buy ? currency_base : currency_target, // from_currency
        buy ? currency_target : currency_base, // to_currency
        buy ? amount_base : amount_target, // from_amount
        buy ? amount_target : amount_base, // to_amount
      )
          
      orderList.push(order);
    } catch (ex) {
      if (ex instanceof InvalidCsvInputError) {
        throw new InvalidCsvInputError(`[line ${i+1}] >> ` + (ex as InvalidCsvInputError).message);
      } else  {
        throw new InvalidCsvInputError(`[line ${i+1}] >> Unspecified error! Please check for valid input data.`);
      }
    }
  }

  return orderList;
}
