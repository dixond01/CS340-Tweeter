import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { Toast } from "../components/toaster/Toast";

export interface ToasterView {
  deleteMessage: (messageId: string) => void;
}

export class ToasterPresenter {
  private _view: ToasterView;

  public constructor(view: ToasterView) {
    this._view = view;
  }

  public deleteExpiredToasts(messageList: Toast[]): Toast[] {
    const now = Date.now();

    for (let message of messageList) {
      if (
        message.expirationMillisecond > 0
        && message.expirationMillisecond < now
      ) {
        this._view.deleteMessage(message.id);
      }
    }
    return messageList;
  }
}
