import { Status, AuthToken } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";

export interface StatusItemView {
  addItems: (newItems: Status[]) => void;
  displayErrorMessage: (message: string) => void;
}

export abstract class StatusItemPresenter {
  private _view: StatusItemView;
  private _statusService: StatusService;
  private _hasMoreItems = true;
  private _lastItem: Status | null = null;

  constructor(view: StatusItemView) {
    this._view = view;
    this._statusService = new StatusService();
  }

  protected get view() {
    return this._view;
  }
  public get hasMoreItems() {
    return this._hasMoreItems;
  }
  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }
  public get lastItem(): Status | null {
    return this._lastItem;
  }
  protected set lastItem(value: Status | null) {
    this._lastItem = value;
  }

  public reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public abstract loadMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): void;
}
