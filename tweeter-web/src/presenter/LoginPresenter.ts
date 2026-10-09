import { User, AuthToken } from "tweeter-shared";
import { AuthService } from "../model.service/AuthService";

export interface LoginView {
  setIsLoading: (value: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  navigate: (path: string) => void;
  displayErrorMessage: (message: string) => void;
}

export class LoginPresenter {
  private _view: LoginView;
  private _authService: AuthService;

  public constructor(view: LoginView) {
    this._view = view;
    this._authService = new AuthService();
  }

  public get view(): LoginView {
    return this._view;
  }

  public checkSubmitButtonStatus(alias: string, password: string): boolean {
    return !alias || !password;
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string | undefined,
  ) {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this._authService.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`,
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }
}
