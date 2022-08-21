
import { parse } from 'csv-parse/lib/sync';
import { ParsedTransfer } from '../../model/txs/transfer';
import { InvalidCsvInputError } from "./errors";
import { cvt_amount_from_str, cvt_currency_from_amount_str } from "./utils";

export function parseTransfers(csv_string: string): ParsedTransfer[] {
    var transferList: ParsedTransfer[] = [];
    const records = parse(csv_string, {delimiter: ','});

    for (let i=1; i<records.length; i++) {
        let rec = records[i];
        try {
            // copy column content
            const raw_date = String(rec[0] ?? "");
            const raw_from_exchange_wallet = String(rec[1] ?? "");
            const raw_to_exchange_wallet = String(rec[2] ?? "");
            const raw_amount = String(rec[3] ?? "");
            const raw_currency = String(rec[4] ?? "");
            const raw_fee = String(rec[5] ?? "");
            // const raw_remark = String(rec[6] ?? "");
            // ---

            const date = new Date(raw_date.endsWith("Z") ? raw_date : (raw_date + "Z"));

            if (raw_from_exchange_wallet.length < 1) throw new InvalidCsvInputError("from exchange_wallet field may not be empty!");
            if (raw_to_exchange_wallet.length < 1) throw new InvalidCsvInputError("to exchange_wallet field may not be empty!");

            if (raw_currency.length < 1) 
                throw new InvalidCsvInputError("Currency field must not be empty!");

            let amount: number = cvt_amount_from_str(raw_amount);

            let fee: number = cvt_amount_from_str(raw_fee)
            let fee_currency: string = cvt_currency_from_amount_str(raw_fee, "EUR")

            let transfer = new ParsedTransfer(
                date, raw_to_exchange_wallet,
                fee, fee_currency,

                raw_from_exchange_wallet,
                amount,
                raw_currency
            )
                
            transferList.push(transfer);
        } catch (ex) {
            if (ex instanceof InvalidCsvInputError) {
              throw new InvalidCsvInputError(`[line ${i+1}] >> ` + (ex as InvalidCsvInputError).message);
            } else  {
              throw new InvalidCsvInputError(`[line ${i+1}] >> Unspecified error! Please check for valid input data.`);
            }
        }
    }

    return transferList;
}

//           let rec = records[i];
//           try {
//               // columns: Date(UTC)	from_exchange_wallet	to_exchange_wallet	coin	amount	fee	remark

//               let _date = new Date(rec[0] + "Z");
//               let _from_exchange_wallet: string = rec[1];
//               let _to_exchange_wallet: string = rec[2];
//               let _coin: string = rec[3];
//               let _amount: number = BinanceParser.cvt_amount_from_str(rec[4]);

//               let _fee: number = BinanceParser.cvt_amount_from_str(rec[5])
//               let _fee_currency: string = BinanceParser.cvt_currency_from_amount_str(rec[5], _coin ?? "EUR")

//               let _remark: string = rec[6];

//               let _deposit = new AtomicTransfer(
//               )
