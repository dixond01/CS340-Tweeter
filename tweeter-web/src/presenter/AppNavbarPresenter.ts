import { AuthToken } from "tweeter-shared";
import { AuthService } from "../model.service/AuthService";
import { MessageView, Presenter } from "./Presenter";

export interface AppNavbarView extends MessageView {
  navigate: (path: string) => void;
  clearUserInfo: () => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView>{
  private _authService: AuthService;

  public constructor(view: AppNavbarView) {
    super(view);
    this._authService = new AuthService();
  }

  public async logOut(authToken: AuthToken): Promise<void> {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
    this.doFailureReportingOperation(async () => {
      await this._authService.logout(authToken);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    }, "log user");
  }
}
