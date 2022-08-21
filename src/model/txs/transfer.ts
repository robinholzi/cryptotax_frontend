import { ParsedTransaction } from "./transaction";

export class ParsedTransfer extends ParsedTransaction {
  from_exchange_wallet: string; // null: false
  amount: number; // null: false
  currency: string; // null: false
  // remark: string; not used by backend

  constructor(
    datetime: Date, to_exchange_wallet: string, 
    fee: number, fee_currency: string,

    from_exchange_wallet: string, 
    amount: number, 
    currency: string
  ) {
    super(datetime, to_exchange_wallet, fee, fee_currency);

    this.from_exchange_wallet = from_exchange_wallet;
    this.amount = amount;
    this.currency = currency;
  }
}
