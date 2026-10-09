import { AuthToken } from "tweeter-shared";
import { AuthService } from "../model.service/AuthService";

export interface AppNavbarView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
  navigate: (path: string) => void;
  clearUserInfo: () => void;
}

export class AppNavbarPresenter {
  private _view: AppNavbarView;
  private _authService: AuthService;

  public constructor(view: AppNavbarView) {
    this._view = view;
    this._authService = new AuthService();
  }

  public async logOut(authToken: AuthToken): Promise<void> {
    const loggingOutToastId = this._view.displayInfoMessage("Logging Out...", 0);

    try {
      await this._authService.logout(authToken);

      this._view.deleteMessage(loggingOutToastId);
      this._view.clearUserInfo();
      this._view.navigate("/login");
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`,
      );
    }
  }
}
