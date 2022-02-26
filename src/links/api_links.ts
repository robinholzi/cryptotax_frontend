
const api_base : string = "http://127.0.0.1:8000/api/v1/"
const api_base_auth : string = `${api_base}user/`
const api_base_portfolio : string = `${api_base}portfolio/`

export const api_login : string = `${api_base_auth}login/`
export const api_signup : string = `${api_base_auth}signup/`
export const api_forget_pw : string = `${api_base_auth}password/forget/`

export const api_portfolio_list_my : string = `${api_base_portfolio}list/my/`
export const api_portfolio_create = (title:string) => `${api_base_portfolio}create/?title=${title}`
export const api_portfolio_detail = (pid:number) => `${api_base_portfolio}${pid}/detail/`
export const api_portfolio_update = (pid:number) => `${api_base_portfolio}${pid}/udpate/`
export const api_portfolio_delete = (pid_list:number[]) => `${api_base_portfolio}delete/?pids=[${
  JSON.stringify(pid_list).replaceAll(/[\\"]/g, "")
}]`

export const api_portfolio_list_reports = (pid:number) => `${api_base_portfolio}${pid}/reports/list/`
export const api_portfolio_list_txs = (pid:number) => `${api_base_portfolio}${pid}/txs/list/`
