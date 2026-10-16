import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { View, Presenter } from "./Presenter";

export interface UserNavigationView extends View {
    setDisplayedUser: (user: User) => void;
    navigate: (path: string) => void;
    displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private _userService: UserService;

  public constructor(view: UserNavigationView) {
    super(view);
    this._userService = new UserService();
  }

  navigateToUser = async (
    eventTargetString: string, 
    featurePath: string,
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> => {
    this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(eventTargetString);

      const toUser = await this.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    }, "get user");
  };

  extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    return await this._userService.getUser(authToken, alias);
  }
}
