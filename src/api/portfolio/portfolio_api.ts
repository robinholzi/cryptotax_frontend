import axios, { AxiosResponse } from "axios";
import { api_portfolio_create, api_portfolio_create_report, api_portfolio_delete, api_portfolio_delete_reports, api_portfolio_delete_txs, api_portfolio_detail, api_portfolio_list_deposits, api_portfolio_list_my, api_portfolio_list_orders, api_portfolio_list_reports, api_portfolio_list_transfers, api_portfolio_update } from "../../links/api_links";
import { stringIsEmpty } from "../../utils/string";

export class Portfolio {
  pid: number = 1;
  title: string = "";
  transactions: number = 0;
  exchanges: number = 0;
  reports: number = 0;
  latest_report_profit: any = 0;
  latest_report_currency: string = "";
  latest_report_date: string = "";
}

export class PortfolioListData {
  dataList: Portfolio[] = [];
  number_portfolios =  undefined;
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

export class PortfolioData {
  pid: number = 0;
  portfolio: any;
  error: string = "";

  constructor(pid: number) {
    this.pid = pid;
  }

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

export enum AnalysisMode {
  PROCESSING,
  ANALYSING,
  FINISHED
}


export function analysisModeFromString(str: string) : AnalysisMode {
  switch (str) {
    case "P": return AnalysisMode.PROCESSING;
    case "A": return AnalysisMode.ANALYSING;
    case "F": return AnalysisMode.FINISHED;
    default: throw Error("Illegal argument: analysisModeFromString")
  }
}

function stringFromAnalysisMode(mode: AnalysisMode) : string {
  switch (mode) {
    case AnalysisMode.PROCESSING: return "P";
    case AnalysisMode.ANALYSING: return "A";
    case AnalysisMode.FINISHED: return "F";
    default: throw Error("Illegal argument: stringFromAnalysisMode")
  }
}

export const analysisModeList = [
  AnalysisMode.PROCESSING, AnalysisMode.ANALYSING, AnalysisMode.FINISHED
]
export const analysisModeStringList = analysisModeList.map((mode) => stringFromAnalysisMode(mode))

export enum TransferAlgo {
  ALGO_FIFO,
  ALGO_LIFO,
  ALGO_OPTIMAL,
  ALGO_WORST
}

export function transferAlgoFromString(str: string) : TransferAlgo {
  switch (str) {
    case "FIFO": return TransferAlgo.ALGO_FIFO;
    case "LIFO": return TransferAlgo.ALGO_LIFO;
    case "OPT": return TransferAlgo.ALGO_OPTIMAL;
    case "WRST": return TransferAlgo.ALGO_WORST;
    default: throw Error("Illegal argument: transferAlgoFromString")
  }
}

export function stringFromTransferAlgo(mode: TransferAlgo) : string {
  switch (mode) {
    case TransferAlgo.ALGO_FIFO: return "FIFO";
    case TransferAlgo.ALGO_LIFO: return "LIFO";
    case TransferAlgo.ALGO_OPTIMAL: return "OPT";
    case TransferAlgo.ALGO_WORST: return "WRST";
    default: throw Error("Illegal argument: stringFromTransferAlgo")
  }
}

export const transferAlgoList = [
  TransferAlgo.ALGO_FIFO, TransferAlgo.ALGO_LIFO, TransferAlgo.ALGO_OPTIMAL, TransferAlgo.ALGO_WORST
]
export const transferAlgoStringList = transferAlgoList.map((algo) => stringFromTransferAlgo(algo))

export enum MiningTaxMethod {
  ON_DEPOSIT_AND_GAINS,
  ON_DEPOSIT_AND_NOT_GAINS,
  NOT_ON_DEPOSIT_AND_FULL_GAINS,
  NOT_ON_DEPOSIT_AND_NOT_GAINS
}

export function miningTaxMethodFromString(str: string) : MiningTaxMethod {
  switch (str) {
    case "D&G": return MiningTaxMethod.ON_DEPOSIT_AND_GAINS;
    case "D&NG": return MiningTaxMethod.ON_DEPOSIT_AND_NOT_GAINS;
    case "ND&FG": return MiningTaxMethod.NOT_ON_DEPOSIT_AND_FULL_GAINS;
    case "ND&NG": return MiningTaxMethod.NOT_ON_DEPOSIT_AND_NOT_GAINS;
    default: throw Error("Illegal argument: miningTaxMethodFromString")
  }
}

export function stringFromMiningTaxMethod(mode: MiningTaxMethod) : string {
  switch (mode) {
    case MiningTaxMethod.ON_DEPOSIT_AND_GAINS: return "D&G";
    case MiningTaxMethod.ON_DEPOSIT_AND_NOT_GAINS: return "D&NG";
    case MiningTaxMethod.NOT_ON_DEPOSIT_AND_FULL_GAINS: return "ND&FG";
    case MiningTaxMethod.NOT_ON_DEPOSIT_AND_NOT_GAINS: return "ND&NG";
    default: throw Error("Illegal argument: stringFromMiningTaxMethod")
  }
}

export function miningTaxMethodLongFromString(str: string) : MiningTaxMethod {
  switch (str) {
    case "Tax on deposit & gains on sell": return MiningTaxMethod.ON_DEPOSIT_AND_GAINS;
    case "Tax on deposit & not on gains": return MiningTaxMethod.ON_DEPOSIT_AND_NOT_GAINS;
    case "No Tax on deposit but on gains": return MiningTaxMethod.NOT_ON_DEPOSIT_AND_FULL_GAINS;
    case "Mined Coins not taxable at all": return MiningTaxMethod.NOT_ON_DEPOSIT_AND_NOT_GAINS;
    default: throw Error("Illegal argument: miningTaxMethodLongFromString")
  }
}

export function stringFromMiningTaxMethodLong(mode: MiningTaxMethod) : string {
  switch (mode) {
    case MiningTaxMethod.ON_DEPOSIT_AND_GAINS: return "Tax on deposit & gains on sell";
    case MiningTaxMethod.ON_DEPOSIT_AND_NOT_GAINS: return "Tax on deposit & not on gains";
    case MiningTaxMethod.NOT_ON_DEPOSIT_AND_FULL_GAINS: return "No Tax on deposit but on gains";
    case MiningTaxMethod.NOT_ON_DEPOSIT_AND_NOT_GAINS: return "Mined Coins not taxable at all";
    default: throw Error("Illegal argument: stringFromMiningTaxMethodLong")
  }
}

export const miningTaxMethodList = [
  MiningTaxMethod.ON_DEPOSIT_AND_GAINS, MiningTaxMethod.ON_DEPOSIT_AND_NOT_GAINS, 
  MiningTaxMethod.NOT_ON_DEPOSIT_AND_FULL_GAINS, MiningTaxMethod.NOT_ON_DEPOSIT_AND_NOT_GAINS
]
export const miningTaxMethodStringList = miningTaxMethodList.map((algo) => stringFromMiningTaxMethod(algo))
export const miningTaxMethodLongStringList = miningTaxMethodList.map((algo) => stringFromMiningTaxMethodLong(algo))

export class Report {
  analysis_id: number = 1;
  title: string = "";
  created: Date;
  mode: AnalysisMode;
  failed: boolean;
  algo: string;
  transfer_algo: string;
  base_currency: string = "";
  
  transactions: number = 0;
  currencies: number = 0;  // amount
  wallets: number = 0;
  taxable_profit: number = 0;
  realized_profit: number = 0;
  fee_sum: number = 0;
  progress: number = 0;
  msg: string = "/";

  // for report detail (not in listing)
  deposit_profit: number = 0;
  sell_profit: number = 0;

  mining_tax_method: number = 0;
  mining_deposit_profit_rate: number = 0;
  taxable_period_days: number = 0;

  constructor(
    analysis_id: number,
    title: string,
    created: Date,
    mode: AnalysisMode,
    failed: boolean,
    algo: string,
    transfer_algo: string,
    base_currency: string,

    transactions: number,
    currencies: number,
    wallets: number,
    taxable_profit: number,
    realized_profit: number,
    fee_sum: number,
    progress: number,
    msg: string
  ) {
    this.analysis_id = analysis_id;
    this.title = title;
    this.created = created;
    this.mode = mode;
    this.failed = failed;
    this.algo = algo;
    this.transfer_algo = transfer_algo;
    this.base_currency = base_currency;

    this.transactions = transactions;
    this.currencies = currencies;
    this.wallets = wallets;
    this.taxable_profit = taxable_profit;
    this.realized_profit = realized_profit;
    this.fee_sum = fee_sum;
    this.progress = progress;
    this.msg = msg;
  }

}

export class ReportListData {
  dataList: Report[] = [];
  error: string = "";
  number_reports = undefined;

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

export class Transaction {
  tid: number;
  datetime: Date;
  exchange_wallet: string;
  fee_currency: string;
  fee: number;

  constructor(
    tid: number,
    datetime: Date,
    exchange_wallet: string,
    fee_currency: string,
    fee: number
  ) {
    this.tid=tid;
    this.datetime=datetime;
    this.exchange_wallet=exchange_wallet;
    this.fee_currency=fee_currency;
    this.fee=fee;
  }

}

export class Order extends Transaction {
  oid: number;
  from_currency: string;
  from_amount: number;
  to_currency: string;
  to_amount: number;

  constructor(
    tid: number,
    datetime: Date,
    exchange_wallet: string,
    fee_currency: string,
    fee: number,

    oid: number,
    from_currency: string,
    from_amount: number,
    to_currency: string,
    to_amount: number
  ) {
    super(tid, datetime, exchange_wallet, fee_currency, fee);

    this.oid=oid;
    this.from_currency=from_currency;
    this.from_amount=from_amount;
    this.to_currency=to_currency;
    this.to_amount=to_amount;
  }
}

export class Deposit extends Transaction {
  did: number;
  buy_datetime: Date;
  currency: string;
  amount: number;
  taxable: boolean;
  type: string;

  constructor(
    tid: number,
    datetime: Date,
    exchange_wallet: string,
    fee_currency: string,
    fee: number,

    did: number,
    buy_datetime: Date,
    currency: string,
    amount: number,
    taxable: boolean,
    type: string
  ) {
    super(tid, datetime, exchange_wallet, fee_currency, fee);

    this.did=did;
    this.buy_datetime=buy_datetime;
    this.currency=currency;
    this.amount=amount;
    this.taxable=taxable;
    this.type=type;
  }
}

export class Transfer extends Transaction {
  tfid: number;
  currency: string;
  amount: number;
  from_exchange_wallet: string;

  constructor(
    tid: number,
    datetime: Date,
    exchange_wallet: string,
    fee_currency: string,
    fee: number,

    tfid: number,
    currency: string,
    amount: number,
    from_exchange_wallet: string
  ) {
    super(tid, datetime, exchange_wallet, fee_currency, fee);

    this.tfid=tfid;
    this.currency=currency;
    this.amount=amount;
    this.from_exchange_wallet=from_exchange_wallet;
  }
}

class TransactionListData<TxType> {
  txs: TxType[] = [];
  error: string = "";
  number_txs =  undefined;

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

export class OrderListData extends TransactionListData<Order> {}
export class DepositListData extends TransactionListData<Deposit> {}
export class TransferListData extends TransactionListData<Transfer> {}

export async function portfolio_list_my(token: string, portfolioListData: PortfolioListData, 
  page_size: number, page_number: number) {

  const response: AxiosResponse = 
  await axios({
      method: "get",
      url: api_portfolio_list_my(page_size ?? 25, page_number ?? 1), 
      headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Token ${token}` 
      },
  }).catch((err) => err.response);
  
  if (response == null) {
    portfolioListData.error = 'Unknown Error';
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
            const {page_size, number_pages, number_portfolios, portfolios}: any = data;

            if (page_size == null || number_pages == null || number_portfolios == null || portfolios == null) {
              return 'Unknown Error';
            }
            portfolioListData.dataList = [];
            portfolioListData.number_portfolios = number_portfolios;
            for (const rawPort of portfolios) {
              try {
                var new_port = new Portfolio()
                new_port.pid=Number.parseInt(rawPort.id);
                new_port.title=String(rawPort.title);
                new_port.transactions=Number.parseInt(rawPort.transactions);
                new_port.exchanges=Number.parseInt(rawPort.exchanges);
                new_port.reports=Number.parseInt(rawPort.reports);
                new_port.latest_report_profit=rawPort.latest_report_profit 
                  ? Number.parseFloat(rawPort.latest_report_profit) : null;
                new_port.latest_report_currency=String(rawPort.latest_report_currency ?? "");
                new_port.latest_report_date=String(rawPort.latest_report_date ?? "/");
                portfolioListData.dataList.push(new_port);
              } catch { /* skip */ }
            }
          }
      } else {
        portfolioListData.error = title ?? 'Unknown Error';
      }
    }
  }
}


export async function portfolio_data(token: string, portfolioData: PortfolioData) {
  const response: AxiosResponse = 
  await axios({
      method: "get",
      url: api_portfolio_detail(portfolioData.pid), 
      headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Token ${token}` 
      },
  }).catch((err) => err.response);
  
  if (response == null) {
    portfolioData.error = 'Unknown Error';
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
              const rawPort = data;
              var new_port = new Portfolio()
              new_port.pid=Number.parseInt(rawPort.id);
              new_port.title=String(rawPort.title);
              new_port.transactions=Number.parseInt(rawPort.transactions);
              new_port.exchanges=Number.parseInt(rawPort.exchanges);
              new_port.reports=Number.parseInt(rawPort.reports);
              new_port.latest_report_profit=rawPort.latest_report_profit 
                ? Number.parseFloat(rawPort.latest_report_profit) : null;
              new_port.latest_report_currency=String(rawPort.latest_report_currency ?? "");
              new_port.latest_report_date=String(rawPort.latest_report_date ?? "/");
              portfolioData.portfolio = new_port;
            } catch {
              portfolioData.error = 'Unknown Error';
              return;
            }
          }
      } else {
        portfolioData.error = title ?? 'Unknown Error';
      }
    }
  }
}

export async function portfolio_create(token: string, title: string): Promise<string> {
  const response: AxiosResponse = 
  await axios({
      method: "post",
      url: api_portfolio_create(title), 
      headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Token ${token}` 
      },
  }).catch((err) => err.response);
  
  if (response == null) {
    return 'Unknown Error';
  } else {
    const { data: postResponseData }: any = response;
    if (postResponseData == null) {
      return 'Unknown Error';
    } else {
      const { title, code }: any = postResponseData;
      if (response.status === 200) {
          const {data}: any = postResponseData;
          if ((data + "") === (null + "")) {
            return 'Unknown Error';
          } else {
            if (code === 0) return "success";
            return 'Unknown Error';
          }
      } else {
        return title ?? 'Unknown Error';
      }
    }
  }
}


export async function portfolio_update(token: string, pid: number, title: string): Promise<string> {
  const response: AxiosResponse = 
  await axios({
      method: "put",
      url: api_portfolio_update(pid, title), 
      headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Token ${token}` 
      },
  }).catch((err) => err.response);
  
  if (response == null) {
    return 'Unknown Error';
  } else {
    const { data: postResponseData }: any = response;
    if (postResponseData == null) {
      return 'Unknown Error';
    } else {
      const { title, code }: any = postResponseData;
      if (response.status === 200) {
          const {data}: any = postResponseData;
          if ((data + "") === (null + "")) {
            return 'Unknown Error';
          } else {
            if (code === 0) return "success";
            return 'Unknown Error';
          }
      } else {
        return title ?? 'Unknown Error';
      }
    }
  }
}

export async function portfolio_delete(token: string, pid_list: number[]): Promise<string> {
  const response: AxiosResponse = 
  await axios({
      method: "delete",
      url: api_portfolio_delete(pid_list), 
      headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Token ${token}` 
      },
  }).catch((err) => err.response);
  
  if (response == null) {
    return 'Unknown Error';
  } else {
      const { data: postResponseData }: any = response;
      if (postResponseData == null) {
        return 'Unknown Error';
      } else {
        const { title, code }: any = postResponseData;
        if (response.status === 200) {
            const {data}: any = postResponseData;
            if ((data + "") === (null + "")) {
              return 'Unknown Error';
            } else {
              if (code === 0) return "success";
              return 'Unknown Error';
            }
        } else {
          return title ?? 'Unknown Error';
        }
      }
  }
}

export async function portfolio_reports(
  token: string, pid: number, reportListData: ReportListData,
  page_size: number, page_number: number) {
  const response: AxiosResponse = 
  await axios({
      method: "get",
      url: api_portfolio_list_reports(pid, page_size ?? 25, page_number ?? 1), 
      headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Token ${token}` 
      },
  }).catch((err) => err.response);
  
  if (response == null) {
    reportListData.error = 'Unknown Error';
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
            reportListData.dataList = [];
            // page_size, number_pages
            const number_reports = data.number_reports;
            const reports = data.reports;
            reportListData.dataList = [];
            reportListData.number_reports = number_reports;
            for (const raw of reports) {
              try {
                const analysis_id = Number.parseInt(raw.ana_id);
                const title = String(raw.title ?? "");
                const created = new Date(String(raw.created ?? ""));
                const mode = analysisModeFromString(String(raw.mode));
                const failed = String(raw.failed) === "true";
                const algo = String(raw.algo ?? "");
                const transfer_algo = String(raw.transfer_algo ?? "");
                const base_currency = String(raw.base_currency ?? "");

                const transactions = raw.txs ? Number.parseInt(raw.txs) : 0;
                const currencies = raw.currencies ? Number.parseInt(raw.currencies) : 0;
                const wallets = raw.wallets ? Number.parseInt(raw.wallets) : 0;
                const taxable_profit = raw.taxable_profit ? Number.parseFloat(raw.taxable_profit) : 0.0;
                const realized_profit = raw.realized_profit ? Number.parseFloat(raw.realized_profit) : 0.0;
                const fee_sum = raw.fee_sum ? Number.parseFloat(raw.fee_sum) : 0.0;
                const progress = raw.progress ? Number.parseFloat(raw.progress) : 0.0;
                const msg=String(raw.msg ?? "/");
                
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
                  wallets,
                  taxable_profit,
                  realized_profit,
                  fee_sum,
                  progress,
                  msg
                );
                reportListData.dataList.push(new_port);
              } catch (ex) { /* skip */ 
                console.log(ex)
              }
            }
          }
      } else {
        reportListData.error = title ?? 'Unknown Error';
      }
    }
  }
}

export async function portfolio_report_create(token: string, pid: number,
  reportName: string,
  baseCurrencyTag: string,
  analysisAlgorithm: string,
  transferAlgorithm: string,
  untaxedAllowance: number,
  taxablePeriodDays: number,
  miningTaxMethod: string,
  miningDepositProfitRate: number,
  allowCrossWalletSells: boolean): Promise<string> {


  const bodyFormData: FormData = new FormData();
  bodyFormData.append("title", reportName);
  bodyFormData.append("base_currency", baseCurrencyTag);
  bodyFormData.append("algo", analysisAlgorithm);
  bodyFormData.append("transfer_algo", transferAlgorithm);
  bodyFormData.append("untaxed_allowance", untaxedAllowance.toString());
  bodyFormData.append("mining_tax_method", miningTaxMethod.toString());
  bodyFormData.append("mining_deposit_profit_rate", miningDepositProfitRate.toString());
  bodyFormData.append("cross_wallet_sells", allowCrossWalletSells.toString());
  if (taxablePeriodDays >= 0) {
    bodyFormData.append("taxable_period_days", taxablePeriodDays.toString());
  }

  const response: AxiosResponse = 
    await axios({
        method: "post",
        url: api_portfolio_create_report(pid),
        data: bodyFormData, 
        headers: { 
            "Content-Type": "multipart/form-data",
            "Authorization": `Token ${token}` 
        },
    }).catch((err) => err.response);
    
    if (response == null) {
      return 'Unknown Error';
    } else {
      const { data: postResponseData }: any = response;
      if (postResponseData == null) {
        return 'Unknown Error';
      } else {
        const { title, code }: any = postResponseData;
        if (response.status === 200) {
            const {data}: any = postResponseData;
            if ((data + "") === (null + "")) {
              return 'Unknown Error';
            } else {
              if (code === 0) return "success";
              return 'Unknown Error';
            }
        } else {
          return title ?? 'Unknown Error';
        }
      }
    }
}


export async function reports_delete(token: string, pid:number, rid_list: number[]): Promise<string> {
  const response: AxiosResponse = 
  await axios({
      method: "delete",
      url: api_portfolio_delete_reports(pid, rid_list), 
      headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Token ${token}` 
      },
  }).catch((err) => err.response);
  
  if (response == null) {
    return 'Unknown Error';
  } else {
      const { data: postResponseData }: any = response;
      if (postResponseData == null) {
        return 'Unknown Error';
      } else {
        const { title, code }: any = postResponseData;
        if (response.status === 200) {
            const {data}: any = postResponseData;
            if ((data + "") === (null + "")) {
              return 'Unknown Error';
            } else {
              if (code === 0) return "success";
              return 'Unknown Error';
            }
        } else {
          return title ?? 'Unknown Error';
        }
      }
  }
}


export async function portfolio_orders(token: string, pid: number, orderListData: OrderListData,
  page_size: number, page_number: number) {
  const response: AxiosResponse = 
  await axios({
      method: "get",
      url: api_portfolio_list_orders(pid, page_size ?? 25, page_number ?? 1), 
      headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Token ${token}` 
      },
  }).catch((err) => err.response);
  
  if (response == null) {
    orderListData.error = 'Unknown Error';
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
            // page_size, number_pages
            const number_txs = data.number_txs;
            const txs = data.txs;
            orderListData.txs = [];
            orderListData.number_txs = number_txs;

            for (const raw of txs) {
              try {
                const tid=Number.parseInt(raw.tid);
                const datetime=new Date(String(raw.datetime));
                const exchange_wallet=String(raw.exchange_wallet);
                const fee_currency=String(raw.fee_currency);
                const fee=parseFloat(raw.fee);

                const oid=Number.parseInt(raw.oid);
                const from_currency=String(raw.from_currency);
                const from_amount=Number.parseFloat(raw.from_amount);
                const to_currency=String(raw.to_currency);
                const to_amount=Number.parseFloat(raw.to_amount);

                const order = new Order(
                  tid, datetime, exchange_wallet, fee_currency, fee, 
                  oid, from_currency, from_amount, to_currency, to_amount
                )
                orderListData.txs.push(order);
              } catch { /* skip */ }
            }
          }
      } else {
        orderListData.error = title ?? 'Unknown Error';
      }
    }
  }
}

export async function portfolio_deposits(token: string, pid: number, depositListData: DepositListData,
  page_size: number, page_number: number) {
  const response: AxiosResponse = 
  await axios({
      method: "get",
      url: api_portfolio_list_deposits(pid, page_size ?? 25, page_number ?? 1), 
      headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Token ${token}` 
      },
  }).catch((err) => err.response);
  
  if (response == null) {
    depositListData.error = 'Unknown Error';
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
            // page_size, number_pages
            const number_txs = data.number_txs;
            const txs = data.txs;
            depositListData.txs = [];
            depositListData.number_txs = number_txs;
            for (const raw of txs) {
              try {
                const tid=Number.parseInt(raw.tid);
                const datetime=new Date(String(raw.datetime));
                const exchange_wallet=String(raw.exchange_wallet);
                const fee_currency=String(raw.fee_currency);
                const fee=parseFloat(raw.fee);

                const did=Number.parseInt(raw.did);
                const buy_datetime=new Date(String(raw.buy_datetime));
                const currency=String(raw.currency);
                const amount=Number.parseFloat(raw.amount);
                const taxable=String(raw.taxable).toLowerCase() === 'true';
                const type=String(raw.type);

                const deposit = new Deposit(
                  tid, datetime, exchange_wallet, fee_currency, fee, 
                  did, buy_datetime, currency, amount, taxable, type
                )
                depositListData.txs.push(deposit);
              } catch { /* skip */ }
            }
          }
      } else {
        depositListData.error = title ?? 'Unknown Error';
      }
    }
  }
}

export async function portfolio_transfers(token: string, pid: number, transferListdata: TransferListData,
  page_size: number, page_number: number) {
  const response: AxiosResponse = 
  await axios({
      method: "get",
      url: api_portfolio_list_transfers(pid, page_size ?? 25, page_number ?? 1), 
      headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Token ${token}` 
      },
  }).catch((err) => err.response);
  
  if (response == null) {
    transferListdata.error = 'Unknown Error';
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
            // page_size, number_pages
            const number_txs = data.number_txs;
            const txs = data.txs;
            transferListdata.txs = [];
            transferListdata.number_txs = number_txs;
            for (const raw of txs) {
              try {
                const tid=Number.parseInt(raw.taid);
                const datetime=new Date(String(raw.datetime));
                const exchange_wallet=String(raw.exchange_wallet);
                const fee_currency=String(raw.fee_currency);
                const fee=parseFloat(raw.fee);

                const tfid=Number.parseInt(raw.tfid);
                const currency=String(raw.currency);
                const amount=Number.parseFloat(raw.amount);
                const from_exchange_wallet=String(raw.from_exchange_wallet);

                const transfer = new Transfer(
                  tid, datetime, exchange_wallet, fee_currency, fee, 
                  tfid, currency, amount, from_exchange_wallet
                )
                transferListdata.txs.push(transfer);
              } catch { /* skip */ }
            }
          }
      } else {
        transferListdata.error = title ?? 'Unknown Error';
      }
    }
  }
}

export async function portfolio_txs_delete(token: string, pid:number, tid_list: number[]): Promise<string> {
  const response: AxiosResponse = 
  await axios({
      method: "delete",
      url: api_portfolio_delete_txs(pid, tid_list), 
      headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Token ${token}` 
      },
  }).catch((err) => err.response);
  
  if (response == null) {
    return 'Unknown Error';
  } else {
      const { data: postResponseData }: any = response;
      if (postResponseData == null) {
        return 'Unknown Error';
      } else {
        const { title, code }: any = postResponseData;
        if (response.status === 200) {
            const {data}: any = postResponseData;
            if ((data + "") === (null + "")) {
              return 'Unknown Error';
            } else {
              if (code === 0) return "success";
              return 'Unknown Error';
            }
        } else {
          return title ?? 'Unknown Error';
        }
      }
  }
}
