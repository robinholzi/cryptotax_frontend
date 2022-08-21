
import { parse } from 'csv-parse/lib/sync';
import { ParsedDeposit } from "../../model/txs/deposit";
import { InvalidCsvInputError } from "./errors";
import { cvt_amount_from_str, cvt_currency_from_amount_str } from "./utils";

export function parseDeposits(csv_string: string): ParsedDeposit[] {
    var depositList: ParsedDeposit[] = [];
    const records = parse(csv_string, {delimiter: ','});

    for (let i=1; i<records.length; i++) {
        let rec = records[i];
        try {
            // copy column content
            const raw_date = String(rec[0] ?? "");
            const raw_exchange_wallet = String(rec[1] ?? "");
            const raw_type = String(rec[2] ?? "");
            const raw_buy_date = String(rec[3] ?? "");

            const raw_amount = String(rec[4] ?? "");
            const raw_currency = String(rec[5] ?? "");
            const raw_taxable = String(rec[6] ?? "");
            const raw_fee = String(rec[7] ?? "");
            // const raw_remark = String(rec[8] ?? "");
            // ---

            const date = new Date(raw_date.endsWith("Z") ? raw_date : (raw_date + "Z"));

            let buy_date = date;
            if (raw_buy_date.length >= 1) {
                buy_date = new Date(raw_buy_date.endsWith("Z") ? raw_buy_date : (raw_buy_date + "Z"));
            }

            let type;
            if (raw_type.length < 1) type = "G";
            else if (
                raw_type.toUpperCase() === "G" 
                || raw_type.toUpperCase() === "C" 
                || raw_type.toUpperCase() === "POW" 
                || raw_type.toUpperCase() === "CI" 
                ) type = raw_type.toUpperCase();
            else throw new InvalidCsvInputError("(deposit) type field must be either empty (use GENERAL), 'G' (GENERAL), 'C' (CUSTOM_RATE), 'POW' (POW_MINING) or 'CI' (CAPITAL_INTEREST)");

            if (raw_currency.length < 1) 
                throw new InvalidCsvInputError("Currency field must not be empty!");

            let amount: number = cvt_amount_from_str(raw_amount);

            let taxable: number = Number.parseFloat(raw_taxable);
            if (Math.abs(taxable) > 1) 
                throw Error("Taxable field value invalid: requires 0 <= taxable <= 1")

            let fee: number = cvt_amount_from_str(raw_fee)
            let fee_currency: string = cvt_currency_from_amount_str(raw_fee, "EUR")

            let deposit = new ParsedDeposit(
                date, raw_exchange_wallet,
                fee, fee_currency,

                type,
                buy_date,
                amount,
                raw_currency,
                Math.abs(taxable)
            )
                
            depositList.push(deposit);
        } catch (ex) {
            if (ex instanceof InvalidCsvInputError) {
              throw new InvalidCsvInputError(`[line ${i+1}] >> ` + (ex as InvalidCsvInputError).message);
            } else  {
              throw new InvalidCsvInputError(`[line ${i+1}] >> Unspecified error! Please check for valid input data.`);
            }
        }
    }

    return depositList;
}
