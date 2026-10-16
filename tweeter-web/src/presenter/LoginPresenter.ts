import { User, AuthToken } from "tweeter-shared";
import { AuthService } from "../model.service/AuthService";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
  setIsLoading: (value: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  navigate: (path: string) => void;
}

export class LoginPresenter extends Presenter<LoginView> {
  private _authService: AuthService;

  public constructor(view: LoginView) {
    super(view);
    this._authService = new AuthService();
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
      this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await this._authService.login(
          alias,
          password,
        );

        this.view.updateUserInfo(user, user, authToken, rememberMe);

        if (!!originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate(`/feed/${user.alias}`);
        }
      }, "log user");
    } finally {
      this.view.setIsLoading(false);
    }
  }
}
