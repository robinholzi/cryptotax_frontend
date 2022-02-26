import axios, { AxiosResponse } from "axios";
import { api_portfolio_create, api_portfolio_delete, api_portfolio_detail, api_portfolio_list_my, api_portfolio_list_reports, api_portfolio_list_txs, api_portfolio_update } from "../../links/api_links";
import { api_login } from "../../links/api_links";
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

export class Report {
  // pid: number = 1;
  // title: string = "";
  // transactions: number = 0;
  // exchanges: number = 0;
  // reports: number = 0;
  // latest_report_profit: any = 0;
  // latest_report_currency: string = "";
  // latest_report_date: string = "";
}

export class ReportListData {
  dataList: Report[] = [];
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


export class Transaction {
  // pid: number = 1;
  // title: string = "";
  // transactions: number = 0;
  // exchanges: number = 0;
  // reports: number = 0;
  // latest_report_profit: any = 0;
  // latest_report_currency: string = "";
  // latest_report_date: string = "";
}

export class TxListData {
  dataList: Transaction[] = [];
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


export async function portfolio_list_my(token: string, portfolioListData: PortfolioListData) {
  const response: AxiosResponse = 
  await axios({
      method: "get",
      url: api_portfolio_list_my, 
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
      const { title, code }: any = postResponseData;
      if (response.status === 200) {
          const {data}: any = postResponseData;
          if (data == null) {
            return 'Unknown Error';
          } else {
            portfolioListData.dataList = [];
            for (const rawPort of data) {
              try {
                var new_port = new Portfolio()
                new_port.pid=Number.parseInt(rawPort.id);
                new_port.title=String(rawPort.title);
                new_port.transactions=Number.parseInt(rawPort.transactions);
                new_port.exchanges=Number.parseInt(rawPort.exchanges);
                new_port.reports=Number.parseInt(rawPort.reports);
                new_port.latest_report_profit=rawPort.latest_report_profit 
                  ? Number.parseFloat(rawPort.latest_report_profit) : "/";
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
      const { title, code }: any = postResponseData;
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
                ? Number.parseFloat(rawPort.latest_report_profit) : "/";
              new_port.latest_report_currency=String(rawPort.latest_report_currency ?? "");
              new_port.latest_report_date=String(rawPort.latest_report_date ?? "/");
              portfolioData.portfolio = new_port;
            } catch {
              console.log("asdf");
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
          if (data == null) {
            return 'Unknown Error';
          } else {
            if (code == 0) return "success";
            return 'Unknown Error';
          }
      } else {
        return title ?? 'Unknown Error';
      }
    }
  }
}


export async function portfolio_update(token: string, pid: number): Promise<string> {
  const response: AxiosResponse = 
  await axios({
      method: "put",
      url: api_portfolio_update(pid), 
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
          if (data == null) {
            return 'Unknown Error';
          } else {
            if (code == 0) return "success";
            return 'Unknown Error';
          }
      } else {
        return title ?? 'Unknown Error';
      }
    }
  }
}

export async function portfolio_delete(token: string, pid_list: number[]): Promise<string> {
  console.log(api_portfolio_delete(pid_list));
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
            if (data == null) {
              return 'Unknown Error';
            } else {
              if (code == 0) return "success";
              return 'Unknown Error';
            }
        } else {
          return title ?? 'Unknown Error';
        }
      }
  }
}


export async function portfolio_reports(token: string, pid: number, reportListData: ReportListData) {
  const response: AxiosResponse = 
  await axios({
      method: "get",
      url: api_portfolio_list_reports(pid), 
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
      const { title, code }: any = postResponseData;
      if (response.status === 200) {
          const {data}: any = postResponseData;
          if (data == null) {
            return 'Unknown Error';
          } else {
            reportListData.dataList = [];
            for (const rawPort of data) {
              try {
                // var new_port = new Portfolio()
                // new_port.pid=Number.parseInt(rawPort.id);
                // new_port.title=String(rawPort.title);
                // new_port.transactions=Number.parseInt(rawPort.transactions);
                // new_port.exchanges=Number.parseInt(rawPort.exchanges);
                // new_port.reports=Number.parseInt(rawPort.reports);
                // new_port.latest_report_profit=rawPort.latest_report_profit 
                //   ? Number.parseFloat(rawPort.latest_report_profit) : "/";
                // new_port.latest_report_currency=String(rawPort.latest_report_currency ?? "");
                // new_port.latest_report_date=String(rawPort.latest_report_date ?? "/");
                // portfolioListData.dataList.push(new_port);
              } catch { /* skip */ }
            }
          }
      } else {
        reportListData.error = title ?? 'Unknown Error';
      }
    }
  }
}


export async function portfolio_txs(token: string, pid: number, txListData: TxListData) {
  const response: AxiosResponse = 
  await axios({
      method: "get",
      url: api_portfolio_list_txs(pid), 
      headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Token ${token}` 
      },
  }).catch((err) => err.response);
  
  if (response == null) {
    txListData.error = 'Unknown Error';
  } else {
    const { data: postResponseData }: any = response;
    if (postResponseData == null) {
      return 'Unknown Error';
    } else {
      const { title, code }: any = postResponseData;
      if (response.status === 200) {
          const {data}: any = postResponseData;
          if (data == null) {
            return 'Unknown Error';
          } else {
            txListData.dataList = [];
            for (const rawPort of data) {
              try {
                // var new_port = new Portfolio()
                // new_port.pid=Number.parseInt(rawPort.id);
                // new_port.title=String(rawPort.title);
                // new_port.transactions=Number.parseInt(rawPort.transactions);
                // new_port.exchanges=Number.parseInt(rawPort.exchanges);
                // new_port.reports=Number.parseInt(rawPort.reports);
                // new_port.latest_report_profit=rawPort.latest_report_profit 
                //   ? Number.parseFloat(rawPort.latest_report_profit) : "/";
                // new_port.latest_report_currency=String(rawPort.latest_report_currency ?? "");
                // new_port.latest_report_date=String(rawPort.latest_report_date ?? "/");
                // portfolioListData.dataList.push(new_port);
              } catch { /* skip */ }
            }
          }
      } else {
        txListData.error = title ?? 'Unknown Error';
      }
    }
  }
}