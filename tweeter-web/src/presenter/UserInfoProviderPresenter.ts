import { UserInfo } from "../components/userInfo/UserInfo";
import { User, AuthToken } from "tweeter-shared";

const CURRENT_USER_KEY: string = "CurrentUserKey";
const AUTH_TOKEN_KEY: string = "AuthTokenKey";

export class UserInfoProviderPresenter {

  public saveToLocalStorage(currentUser: User, authToken: AuthToken): void {
    localStorage.setItem(CURRENT_USER_KEY, currentUser.toJson());
    localStorage.setItem(AUTH_TOKEN_KEY, authToken.toJson());
  };

  public retrieveFromLocalStorage(): UserInfo {
    const loggedInUser = User.fromJson(localStorage.getItem(CURRENT_USER_KEY));
    const authToken = AuthToken.fromJson(localStorage.getItem(AUTH_TOKEN_KEY));

    if (!!loggedInUser && !!authToken) {
      return {
        currentUser: loggedInUser,
        displayedUser: loggedInUser,
        authToken: authToken,
      };
    } else {
      return { currentUser: null, displayedUser: null, authToken: null };
    }
  };

  public clearLocalStorage(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };
}
