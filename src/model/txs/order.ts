import { ParsedTransaction } from "./transaction";


export class ParsedOrder extends ParsedTransaction {
  from_currency: string; // null: false
  to_currency: string; // null: false
  from_amount: number; // null: false
  to_amount: number; // null: false
  // remark: string; not used by backend

  constructor(
    datetime: Date, exchange_wallet: string, 
    fee: number, fee_currency: string,

    from_currency: string, to_currency: string, 
    from_amount: number, to_amount: number) {
      super(datetime, exchange_wallet, fee, fee_currency);
      this.from_currency = from_currency;
      this.to_currency = to_currency;
      this.from_amount = from_amount;
      this.to_amount = to_amount;
    }
}
