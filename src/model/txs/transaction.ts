
export abstract class ParsedTransaction {
  datetime: Date; // blank: false
  exchange_wallet: string; // blank: true -> ""
  fee: number; // blank: true -> 0
  fee_currency: string; // blank: true -> null

  constructor(
    datetime: Date, exchange_wallet: string, 
    fee: number, fee_currency: string) {
      this.datetime = datetime;
      this.exchange_wallet = exchange_wallet;
      this.fee = fee;
      this.fee_currency = fee_currency;
  }

  static dateCompare(a: ParsedTransaction, b: ParsedTransaction): number {
      if (a.datetime < b.datetime) return -1
      else if (a.datetime > b.datetime) return 1;
      return 0;
  }
}
