import axios, { AxiosResponse } from "axios";
import { api_login } from "../links/api_links";
import { stringIsEmpty } from "../utils/string";

export class LoginData {
  emailUsername: string = "";
  password: string = "";
  rememberMe: boolean = false;
  
  error: string = "";
  errorEmailUsername: string = "";
  errorPassword: string = "";
  errorEmailNotVerified: boolean = false;

  token: string = "";

  hasError(): boolean {
      return (!stringIsEmpty(this.error))
          || (!stringIsEmpty(this.errorEmailUsername)) 
          || (!stringIsEmpty(this.errorPassword));
  }

  isSuccess(): boolean {
      return !this.hasError();
  }

  cleanErrors() {
      this.error = "";
      this.errorEmailUsername = "";
      this.errorPassword = "";
  }

  hasErrorEmailUsername(): boolean {
      return (this.errorEmailUsername != null && this.errorEmailUsername.length > 0);
  }

  hasErrorPassword(): boolean {
      return (this.errorPassword != null && this.errorPassword.length > 0);
  }
}

export function localEvaluationLogin(loginData: LoginData) {
    if (stringIsEmpty(loginData.emailUsername)) {
        loginData.errorEmailUsername = 'Must not be empty!';
    }
    if (stringIsEmpty(loginData.password)) {
        loginData.errorPassword = 'Must not be empty!';
    }
}

function api_loginUser_dummy(loginData: LoginData) {
    loginData.cleanErrors();
    loginData.token = "eeadf870e70c34d9123bccd6a90e5e16a0e71643";
}

export async function api_loginUser(loginData: LoginData) {
    // api_loginUser_dummy(loginData);
    // return;

    localEvaluationLogin(loginData);
    if (loginData.hasError()) return;

    const bodyFormData: FormData = new FormData();
    bodyFormData.append("email_username", loginData.emailUsername);
    bodyFormData.append("password", loginData.password);
    
    const postResponseLogin: AxiosResponse = 
    await axios({
        method: "post",
        url: api_login, 
        data: bodyFormData,
        headers: { 
            "Content-Type": "multipart/form-data",
        },
    }).catch((err) => err.response);
    
    if (postResponseLogin == null) {
        loginData.error = 'Unknown Error';
    } else {
        const { data: postResponseData }: any = postResponseLogin;
        if (postResponseData == null) {
            loginData.error = 'Unknown Error';
            return;
        }
        if (postResponseLogin.status === 200) {
            const {data}: any = postResponseData;
            if (data == null) {
                loginData.error = 'Unknown Error';
            } else {
                const {token}: any = data;
                if (token) {
                    loginData.token = token;
                } else {
                    loginData.error = 'Unknown Error';
                }
            }
            // everything okay :)

        } else {
            const {data}: any = postResponseData;
            if (data == null) {
                loginData.error = 'Unknown Error';
            }
            if (postResponseLogin.status === 401) {
                // const {code} = postResponseData;
                // const email = data.email;
                // const username = data.username;
                // if (code === 0) {
                //     loginData.errorEmailNotVerified = true;
                // } else {
                loginData.error = 'Unknown Error';
                // }
            } else if (postResponseLogin.status === 400) {
                const nonFieldError = data.non_field_errors;
                const emailUsernameError = data.email_username;
                const passwordError = data.password;
                if (nonFieldError) {
                    loginData.error = nonFieldError;
                }
                if (emailUsernameError) {
                    loginData.errorEmailUsername = emailUsernameError;
                }
                if (passwordError) {
                    loginData.errorPassword = passwordError;
                }
            } else {
                loginData.error = 'Unknown Error';
            }
        }
    }
}





