import { ParsedTransaction } from "./transaction";


export class ParsedDeposit extends ParsedTransaction {
  type: string; // null=false
  // G (GENERAL), C (CUSTOM_RATE), POW (POW_MINING), CI (CAPITAL_INTEREST)

  buy_datetime: Date; // null=true -> same as date

  amount: number; // null: false
  currency: string; // null: false

  // percentage normalized [0;1]:  taxable profit ratio (at deposit time)
  taxable: number; // null: false

  // remark: string; not used by backend

  constructor(
    datetime: Date, exchange_wallet: string, 
    fee: number, fee_currency: string,
    
    type: string,
    buy_datetime: Date, 
    amount: number, currency: string,
    taxable: number
  ) {
    super(datetime, exchange_wallet, fee, fee_currency);

    this.type = type;
    this.buy_datetime = buy_datetime;
    this.fee = fee;
    this.fee_currency = fee_currency;
    this.amount = amount;
    this.currency = currency;
    this.taxable = taxable;
  }
}
