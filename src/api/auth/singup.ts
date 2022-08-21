import axios, { AxiosResponse } from "axios";
import { api_signup } from "../../links/api_links";
import { stringIsEmpty } from "../../utils/string";

export class SignupData {
  firstName: string = "";
  lastName: string = "";
  username: string = "";
  email: string = "";
  password: string = "";
  repeatPassword: string = "";
  approveTerms: boolean = false;
  
  error: string = "";
  errorFirstName: string = "";
  errorLastName: string = "";
  errorUsername: string = "";
  errorEmail: string = "";
  errorPassword: string = "";
  errorRepeatPassword: string = "";
  errorApproveTerms: string = "";

  hasError(): boolean {
      return (!stringIsEmpty(this.error))
          || (!stringIsEmpty(this.errorFirstName)) 
          || (!stringIsEmpty(this.errorLastName)) 
          || (!stringIsEmpty(this.errorUsername)) 
          || (!stringIsEmpty(this.errorEmail)) 
          || (!stringIsEmpty(this.errorPassword))
          || (!stringIsEmpty(this.errorRepeatPassword))
          || (!stringIsEmpty(this.errorApproveTerms));
  }

  isSuccess(): boolean {
      return !this.hasError();
  }

  cleanErrors() {
      this.error = "";
      this.errorFirstName = "";
      this.errorLastName = "";
      this.errorUsername = "";
      this.errorEmail = "";
      this.errorPassword = "";
      this.errorRepeatPassword = "";
      this.errorApproveTerms = "";
  }

  hasErrorFirstName(): boolean {
      return !stringIsEmpty(this.errorFirstName);
  }

  hasErrorLastName(): boolean {
      return !stringIsEmpty(this.errorLastName);
  }

  hasErrorUsername(): boolean {
      return !stringIsEmpty(this.errorUsername);
  }

  hasErrorEmail(): boolean {
      return !stringIsEmpty(this.errorEmail);
  }

  hasErrorPassword(): boolean {
      return !stringIsEmpty(this.errorPassword);
  }

  hasErrorRepeatPassword(): boolean {
      return !stringIsEmpty(this.errorRepeatPassword);
  }

  hasErrorApproveTerms(): boolean {
      return !stringIsEmpty(this.errorApproveTerms);
  }

}

export function localEvaluationSignup(signupData: SignupData) {
  if (stringIsEmpty(signupData.firstName)) {
    signupData.errorFirstName = 'Must not be empty!';
  }
  if (stringIsEmpty(signupData.lastName)) {
    signupData.errorLastName = 'Must not be empty!';
  }
  if (stringIsEmpty(signupData.email)) {
    signupData.errorEmail = 'Must not be empty!';
  }
  const reqexp_email = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if (!reqexp_email.test(signupData.email)) {
    signupData.errorEmail = 'Not a valid email!';
  }
  if (stringIsEmpty(signupData.username)) {
    signupData.errorUsername = 'Must not be empty!';
  }
  if (stringIsEmpty(signupData.password)) {
    signupData.errorPassword = 'Must not be empty!';
  }
  if (signupData.password.length < 8) {
    signupData.errorPassword = 'passwords must be of length >= 8!';
  }
  if (signupData.repeatPassword !== signupData.password) {
    signupData.errorRepeatPassword = 'Passwords do not match!';
  }
  if (!signupData.approveTerms) {
    signupData.errorApproveTerms = 'You have to accept the terms of service to proceed!';
  }
}

export async function api_post_singup(signupData: SignupData) {
  signupData.cleanErrors()
  localEvaluationSignup(signupData);
  if (signupData.hasError()) return;

  const bodyFormData: FormData = new FormData();
  bodyFormData.append("first_name", signupData.firstName);
  bodyFormData.append("last_name", signupData.lastName);
  bodyFormData.append("username", signupData.username);
  bodyFormData.append("email", signupData.email);
  bodyFormData.append("password", signupData.password);
  bodyFormData.append("password_repeat", signupData.repeatPassword);
    
  const postResponseLogin: AxiosResponse = 
  await axios({
      method: "post",
      url: api_signup, 
      data: bodyFormData,
      headers: { 
          "Content-Type": "multipart/form-data",
      },
  }).catch((err) => err.response);
  
  if (postResponseLogin == null) {
    signupData.error = 'Unknown Error';
  } else {
    const { data: postResponseData }: any = postResponseLogin;
    if (postResponseData == null) {
      signupData.error = 'Unknown Error';
        return;
    }
    if (postResponseLogin.status === 200) {
      // all clear :)

    } else {
        const {data}: any = postResponseData;
        if (data == null) {
          signupData.error = 'Unknown Error';
        }
        if (postResponseLogin.status === 401) {
          signupData.error = 'Unknown Error';
        } else if (postResponseLogin.status === 400) {
          const nonFieldError = data.non_field_errors;
          const usernameError = data.username;
          const emailError = data.email;
          const passwordError = data.password;
          const passwordFirstName = data.first_name;
          const passwordLastName = data.last_name;
          if (nonFieldError) {
            signupData.error = nonFieldError;
          }
          if (usernameError) {
            signupData.errorUsername = usernameError;
          }
          if (emailError) {
            signupData.errorEmail = emailError;
          }
          if (passwordError) {
            signupData.errorPassword = passwordError;
          }
          if (passwordFirstName) {
            signupData.errorFirstName = passwordFirstName;
          }
          if (passwordLastName) {
            signupData.errorLastName = passwordLastName;
          }
        } else {
          signupData.error = 'Unknown Error';
        }
    }
  }
}





