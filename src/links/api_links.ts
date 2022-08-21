
const api_base : string = "http://cryptotax.nerotecs.com/api/v1/"
const api_base_auth : string = `${api_base}user/`
const api_base_portfolio : string = `${api_base}portfolio/`

export const api_login : string = `${api_base_auth}login/`
export const api_reset_password : string = `${api_base_auth}password/reset/`
export const api_signup : string = `${api_base_auth}signup/`
export const api_signup_resend_email : string = `${api_base_auth}signup_resend_email/`
export const api_forget_pw : string = `${api_base_auth}password/forget/`

export const api_portfolio_list_my = (page_size: number, page_number: number) => `${api_base_portfolio}list/my/?page_size=${page_size}&page_no=${page_number}`
export const api_portfolio_create = (title:string) => `${api_base_portfolio}create/?title=${title}`
export const api_portfolio_detail = (pid:number) => `${api_base_portfolio}${pid}/detail/`
export const api_portfolio_update = (pid:number, title: string) => `${api_base_portfolio}${pid}/update/?title=${title}`
export const api_portfolio_delete = (pid_list:number[]) => `${api_base_portfolio}delete/?pids=[${
  JSON.stringify(pid_list).replaceAll(/[\\"]/g, "")
}]`

export const api_portfolio_list_reports = (pid:number, page_size: number, page_number: number) => `${api_base_portfolio}${pid}/reports/list/?page_size=${page_size}&page_no=${page_number}`
export const api_portfolio_delete_reports = (pid:number, rid_list:number[]) => `${api_base_portfolio}${pid}/reports/delete/?rids=[${
  JSON.stringify(rid_list).replaceAll(/[\\"]/g, "")
}]`
export const api_portfolio_create_report = (pid:number) => `${api_base_portfolio}${pid}/report/create/`

export const api_report_detail = (pid:number, rid:number) => `${api_base_portfolio}${pid}/report/${rid}/detail/`

export const api_portfolio_list_orders = (pid:number, page_size: number, page_number: number) => `${api_base_portfolio}${pid}/orders/list/?page_size=${page_size}&page_no=${page_number}`
export const api_portfolio_list_deposits = (pid:number, page_size: number, page_number: number) => `${api_base_portfolio}${pid}/deposits/list/?page_size=${page_size}&page_no=${page_number}`
export const api_portfolio_list_transfers = (pid:number, page_size: number, page_number: number) => `${api_base_portfolio}${pid}/transfers/list/?page_size=${page_size}&page_no=${page_number}`

export const api_portfolio_create_orders = (pid:number) => `${api_base_portfolio}${pid}/orders/create/`
export const api_portfolio_create_deposits = (pid:number) => `${api_base_portfolio}${pid}/deposits/create/`
export const api_portfolio_create_transfers = (pid:number) => `${api_base_portfolio}${pid}/transfers/create/`
export const api_portfolio_delete_txs = (pid:number, tid_list:number[]) => `${api_base_portfolio}${pid}/txs/delete/?tids=[${
  JSON.stringify(tid_list).replaceAll(/[\\"]/g, "")
}]`

export const api_portfolio_currency_list : string = `${api_base_portfolio}currencies/`
