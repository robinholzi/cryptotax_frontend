
import axios, { AxiosResponse } from "axios";
import { api_signup_resend_email } from "../../links/api_links";
import { stringIsEmpty } from "../../utils/string";

export class ResendVerificationEmailData {
  emailUsername: string = "";
  
  error: string = "";
  errorEmailUsername: string = "";

  token: string = "";

  hasError(): boolean {
    return (!stringIsEmpty(this.error))
        || (!stringIsEmpty(this.errorEmailUsername));
  }

  isSuccess(): boolean {
      return !this.hasError();
  }

  cleanErrors() {
    this.error = "";
    this.errorEmailUsername = "";
  }

  hasErrorEmailUsername(): boolean {
    return (this.errorEmailUsername != null && this.errorEmailUsername.length > 0);
  }

}

function localEvaluationResendEmail(resendEmailData: ResendVerificationEmailData) {
  if (stringIsEmpty(resendEmailData.emailUsername)) {
    resendEmailData.errorEmailUsername = 'Must not be empty!';
  }
}

export async function api_resendVerificationEmail(resendEmailData: ResendVerificationEmailData) {
  resendEmailData.cleanErrors();
  localEvaluationResendEmail(resendEmailData);
  if (resendEmailData.hasError()) return;

  const bodyFormData: FormData = new FormData();
  bodyFormData.append("email_username", resendEmailData.emailUsername);
  
  const postResponseLogin: AxiosResponse = 
  await axios({
      method: "post",
      url: api_signup_resend_email, 
      data: bodyFormData,
      headers: { 
          "Content-Type": "multipart/form-data",
      },
  }).catch((err) => err.response);
  
  if (postResponseLogin == null) {
    resendEmailData.error = 'Unknown Error';
  } else {
    const { data: postResponseData }: any = postResponseLogin;
    if (postResponseData == null) {
      resendEmailData.error = 'Unknown Error';
      return;
    }
    if (postResponseLogin.status === 200) {
        // everything okay :)

    } else {
        const {data}: any = postResponseData;
        if (data == null) {
          resendEmailData.error = 'Unknown Error';
        } else {
          if (postResponseLogin.status === 400) {
            const nonFieldError = data.non_field_errors;
            const emailUsernameError = data.email_username;
            if (nonFieldError) {
              resendEmailData.error = nonFieldError[0];
              console.log(nonFieldError[0]);
            }
            if (emailUsernameError) {
              resendEmailData.errorEmailUsername = emailUsernameError;
            }
            if (!resendEmailData.hasError()) resendEmailData.error = 'Unknown Error';
        } else {
          resendEmailData.error = 'Unknown Error';
        }
      }
    }
  }
}
