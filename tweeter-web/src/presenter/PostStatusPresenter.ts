import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { View, Presenter, MessageView } from "./Presenter";

export interface PostStatusView extends MessageView {
  setIsLoading: (value: boolean) => void;
  setPost: (value: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _statusService: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this._statusService = new StatusService();
  }

  public async submitPost(
    post: string,
    currentUser: User,
    authToken: AuthToken,
  ): Promise<void> {
    var postingStatusToastId = "";

    try {
      this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);
        postingStatusToastId = this.view.displayInfoMessage(
          "Posting status...",
          0,
        );

        const status = new Status(post, currentUser, Date.now());

        await this._statusService.postStatus(authToken!, status);

        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      }, "post the status");
    } finally {
      this.view.deleteMessage(postingStatusToastId);
      this.view.setIsLoading(false);
    }
  }

  public checkButtonStatus(
    post: string,
    authToken: AuthToken,
    currentUser: User,
    isLoading: boolean,
  ): boolean {
    return !post.trim() || !authToken || !currentUser || isLoading;
  }
}
