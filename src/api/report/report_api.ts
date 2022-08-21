import axios, { AxiosResponse } from "axios";
import { api_report_detail } from "../../links/api_links";
import { stringIsEmpty } from "../../utils/string";
import { analysisModeFromString, Report } from "../portfolio/portfolio_api";


export class TupleGroupByListEntry {
    key: string = "";
    fee_sum: number = 0;
}

export class TrippleGroupByListEntry {
    key: string = "";
    taxable_profit: number = 0;
    realized_profit: number = 0;
}

export class ReportData {
    report: any; // Report
    profitByCurrency: TrippleGroupByListEntry[] = [];
    profitByExchange: TrippleGroupByListEntry[] = [];
    sellProfitByCurrency: TrippleGroupByListEntry[] = [];
    sellProfitByExchange: TrippleGroupByListEntry[] = [];
    feesByCurrency: TupleGroupByListEntry[] = [];
    feesByExchange: TupleGroupByListEntry[] = [];
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


export async function report_data(token: string, pid: number, rid: number, reportData: ReportData) {
    const response: AxiosResponse = 
    await axios({
        method: "get",
        url: api_report_detail(pid, rid), 
        headers: { 
            "Content-Type": "multipart/form-data",
            "Authorization": `Token ${token}` 
        },
    }).catch((err) => err.response);
    
    if (response == null) {
        reportData.error = 'Unknown Error';
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
              try {
                const rawReport = data;

                // portfolio_id
                const analysis_id = Number.parseInt(rawReport.ana_id);
                const title = String(rawReport.title ?? "");
                const created = new Date(String(rawReport.created ?? ""));
                const mode = analysisModeFromString(String(rawReport.mode ?? ""));
                const failed = String(rawReport.failed) === "true";
                const algo = String(rawReport.algo ?? "");
                const transfer_algo = String(rawReport.transfer_algo ?? "");
                const base_currency = String(rawReport.base_currency ?? "");

                const mining_tax_method = Number.parseInt(rawReport.mining_tax_method ?? "D&G");
                const mining_deposit_profit_rate = Number.parseInt(rawReport.mining_deposit_profit_rate ?? 0.25);
                const taxable_period_days = Number.parseInt(rawReport.taxable_period_days ?? 0);

                const transactions = Number.parseInt(rawReport.txs ?? 0);
                const currencies = Number.parseInt(rawReport.currencies ?? 0);
                const exchanges = Number.parseInt(rawReport.exchanges ?? 0);
                const taxable_profit = Number.parseFloat(rawReport.taxable_profit ?? 0);
                const realized_profit = Number.parseFloat(rawReport.realized_profit ?? 0);
                const deposit_profit = Number.parseFloat(rawReport.deposit_profit ?? 0);
                const sell_profit = Number.parseFloat(rawReport.sell_profit ?? 0);
                const fee_sum = Number.parseFloat(rawReport.fee_sum ?? 0);
                const progress = Number.parseFloat(rawReport.progress ?? 0);
                const msg = String(rawReport.msg ?? "");

                var new_port = new Report(
                    analysis_id,
                    title,
                    created,
                    mode,
                    failed,
                    algo,
                    transfer_algo,
                    base_currency,

                    transactions,
                    currencies,
                    exchanges,
                    taxable_profit,
                    realized_profit,
                    fee_sum,
                    progress,
                    msg
                );

                // for report detail (not in listing)
                new_port.deposit_profit = deposit_profit;
                new_port.sell_profit = sell_profit;

                new_port.mining_tax_method = mining_tax_method;
                new_port.mining_deposit_profit_rate = mining_deposit_profit_rate;
                new_port.taxable_period_days = taxable_period_days;
                // ================================

                reportData.report = new_port;

                // parse 'profits_by_currency'
                reportData.profitByCurrency = [];
                for (const rawEntry of rawReport.profits_by_currency) {
                    try {
                    const entry = new TrippleGroupByListEntry()
                        entry.key = String(rawEntry.currency ?? "");
                        entry.taxable_profit = Number.parseFloat(rawEntry.taxable_profit ?? "0");
                        entry.realized_profit = Number.parseFloat(rawEntry.realized_profit ?? "0");
                        reportData.profitByCurrency.push(entry);
                    } catch { /* skip */ }
                }

                // parse 'profits_by_exchange'
                reportData.profitByExchange = [];
                for (const rawEntry of rawReport.profits_by_exchange) {
                    try {
                        const entry = new TrippleGroupByListEntry()
                        entry.key = String(rawEntry.exchange_wallet ?? "");
                        entry.taxable_profit = Number.parseFloat(rawEntry.taxable_profit ?? "0");
                        entry.realized_profit = Number.parseFloat(rawEntry.realized_profit ?? "0");
                        reportData.profitByExchange.push(entry);
                    } catch { /* skip */ }
                }

                // parse 'sell_profits_by_currency'
                reportData.sellProfitByCurrency = [];
                for (const rawEntry of rawReport.sell_profits_by_currency) {
                    try {
                        const entry = new TrippleGroupByListEntry()
                        entry.key = String(rawEntry.currency ?? "");
                        entry.taxable_profit = Number.parseFloat(rawEntry.taxable_profit ?? "0");
                        entry.realized_profit = Number.parseFloat(rawEntry.realized_profit ?? "0");
                        reportData.sellProfitByCurrency.push(entry);
                    } catch { /* skip */ }
                }

                // parse 'sell_profits_by_exchange'
                reportData.sellProfitByExchange = [];
                for (const rawEntry of rawReport.sell_profits_by_exchange) {
                    try {
                        const entry = new TrippleGroupByListEntry()
                        entry.key = String(rawEntry.exchange_wallet ?? "");
                        entry.taxable_profit = Number.parseFloat(rawEntry.taxable_profit ?? "0");
                        entry.realized_profit = Number.parseFloat(rawEntry.realized_profit ?? "0");
                        reportData.sellProfitByExchange.push(entry);
                    } catch { /* skip */ }
                }

                // parse 'fees_by_currency'
                reportData.feesByCurrency = [];
                for (const rawEntry of rawReport.fees_by_currency) {
                    try {
                        const entry = new TupleGroupByListEntry()
                        entry.key = String(rawEntry.currency ?? "");
                        entry.fee_sum = Number.parseFloat(rawEntry.fee_sum ?? "0");
                        reportData.feesByCurrency.push(entry);
                    } catch { /* skip */ }
                }

                // parse 'fees_by_exchange'
                reportData.feesByExchange = [];
                for (const rawEntry of rawReport.fees_by_exchange) {
                    try {
                        const entry = new TupleGroupByListEntry()
                        entry.key = String(rawEntry.exchange_wallet ?? "");
                        entry.fee_sum = Number.parseFloat(rawEntry.fee_sum ?? "0");
                        reportData.feesByExchange.push(entry);
                    } catch { /* skip */ }
                }

              } catch (ex) {
                  console.log(ex)
                reportData.error = 'Unknown Error';
                return;
              }
            }
        } else {
            reportData.error = title ?? 'Unknown Error';
        }
      }
    }
  }
