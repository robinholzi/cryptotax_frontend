import axios, { AxiosResponse } from "axios";
import { api_reset_password } from "../../links/api_links";
import { stringIsEmpty } from "../../utils/string";

export class ResetPasswordData {
  email: string = "";
  
  error: string = "";
  errorEmail: string = "";

  token: string = "";

  constructor(email: string) {
    this.email = email;
  }

  hasError(): boolean {
      return (!stringIsEmpty(this.error))
          || (!stringIsEmpty(this.errorEmail));
  }

  isSuccess(): boolean {
      return !this.hasError();
  }

  cleanErrors() {
      this.error = "";
      this.errorEmail = "";
  }

  hasErrorEmail(): boolean {
      return (this.errorEmail != null && this.errorEmail.length > 0);
  }
}

export function localEvaluationResetPassword(resetPasswordData: ResetPasswordData) {
  console.log("resetPasswordData.email", resetPasswordData.email)
  if (stringIsEmpty(resetPasswordData.email)) {
    resetPasswordData.errorEmail = 'Must not be empty!';
  }
  const reqexp_email = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if (!reqexp_email.test(resetPasswordData.email)) {
    resetPasswordData.errorEmail = 'Not a valid email!';
  }
}

export async function api_resetPassword(resetPasswordData: ResetPasswordData) {
  resetPasswordData.cleanErrors();
  localEvaluationResetPassword(resetPasswordData);
  if (resetPasswordData.hasError()) return;

  const bodyFormData: FormData = new FormData();
  bodyFormData.append("email", resetPasswordData.email);
  
  const postResponseLogin: AxiosResponse = 
  await axios({
    method: "post",
    url: api_reset_password, 
    data: bodyFormData,
    headers: { 
        "Content-Type": "multipart/form-data",
    },
  }).catch((err) => err.response);
  
  if (postResponseLogin == null) {
    resetPasswordData.error = 'Unknown Error';
  } else {
    const { data: postResponseData }: any = postResponseLogin;
    if (postResponseData == null) {
      resetPasswordData.error = 'Unknown Error';
        return;
    }
    if (postResponseLogin.status === 200) {
      return 'success';
    } else {
      const {data}: any = postResponseData;
      if (data == null) {
        resetPasswordData.error = 'Unknown Error';
      }
      if (postResponseLogin.status === 401) {
        resetPasswordData.error = 'Unknown Error';
      } else if (postResponseLogin.status === 400) {
          const nonFieldError = data.non_field_errors;
          const emailError = data.email_username;
          // const passwordError = data.password;
          if (nonFieldError) {
            resetPasswordData.error = nonFieldError;
          }
          if (emailError) {
            resetPasswordData.errorEmail = emailError;
          }
      } else {
        resetPasswordData.error = 'Unknown Error';
      }
    }
  }
}





