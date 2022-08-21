
export const link_root : string = "/"

export const link_terms : string = "/terms/"

export const link_portfolios : string = "/portfolios/"
export const link_portfolio_import = (id: number) => `/portfolio/${id}/import/`
export const link_portfolio_import_matcher = `/portfolio/:id/import/`

export const link_portfolio = (id: number) => `/portfolio/${id}/`
export const link_portfolio_matcher = `/portfolio/:id/`

export const link_report = (id:number, rid: number) => `/portfolio/${id}/report/${rid}/`
export const link_report_matcher = `/portfolio/:id/report/:rid/`

export const link_login : string = "/auth/login/"
export const link_verification_resend : string = "/auth/verification-resend/"
export const link_verification_resend_sucess : string = "/auth/verification-resend-success/"
export const link_signup : string = "/auth/signup/"
export const link_signup_success : string = "/auth/signup-success/"
export const link_forgot_password : string = "/auth/password/forget/"
