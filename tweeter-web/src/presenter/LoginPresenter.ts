import { User, AuthToken } from "tweeter-shared";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView {}

export class LoginPresenter extends AuthenticationPresenter<LoginView> {
  public checkSubmitButtonStatus(alias: string, password: string): boolean {
    return !alias || !password;
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string | undefined,
  ) {
    const sendLogin = async (): Promise<[User, AuthToken]> => {
      return await this.service.login(alias, password);
    };

    let navigate: string | undefined = undefined;
    if (!!originalUrl) {
      navigate = originalUrl;
    }

    await this.doAuthOperation(sendLogin, rememberMe, "log User", navigate);
  }
}
