import { User, AuthToken } from "tweeter-shared";
import { View, Presenter } from "./Presenter";
import { AuthService } from "../model.service/AuthService";

export interface AuthenticationView extends View {
  setIsLoading: (value: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  navigate: (path: string) => void;
}

export abstract class AuthenticationPresenter<T extends AuthenticationView> extends Presenter<T> {
  private _service: AuthService;

  public constructor(view: T) {
    super(view);
    this._service = new AuthService();
  }

  get service() {
    return this._service;
  }

  public async doAuthOperation(
    authOperation: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    itemDescription: string,
    navigationPath?: string,
  ) {
    try {
      this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await authOperation();

        this.view.updateUserInfo(user, user, authToken, rememberMe);

        if (navigationPath) {
          this.view.navigate(navigationPath);
        } else {
          this.view.navigate(`/feed/${user.alias}`);
        }
      }, itemDescription);
    } finally {
      this.view.setIsLoading(false);
    }
  }
}