import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserNavigationView {
    setDisplayedUser: (user: User) => void;
    navigate: (path: string) => void;
    displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter {
  private _userService: UserService;
  private _view: UserNavigationView;

  public constructor(view: UserNavigationView) {
    this._userService = new UserService();
    this._view = view;
  }

  protected get view(): UserNavigationView {
    return this._view;
  }

  navigateToUser = async (
    eventTargetString: string, 
    featurePath: string,
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> => {

    try {
      const alias = this.extractAlias(eventTargetString);

      const toUser = await this.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
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
