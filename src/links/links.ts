
export const link_root : string = "/"

export const link_portfolios : string = "/portfolios/"

export const link_portfolio = (id: number) => `/portfolio/${id}/`
export const link_portfolio_matcher = `/portfolio/:id/`

export const link_report = (id:number, rid: number) => `/portfolio/${id}/report/${rid}/`
export const link_report_matcher = `/portfolio/:id/report/:rid/`

export const link_login : string = "/auth/login/"
export const link_signup : string = "/auth/signup/"
export const link_forgot_password : string = "/auth/password/forget/"
