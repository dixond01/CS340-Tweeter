import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { MessageView, Presenter, View } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setFollowerCount: (value: number) => void;
  setFolloweeCount: (value: number) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private _followService: FollowService;

  constructor(view: UserInfoView) {
    super(view);
    this._followService = new FollowService();
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this._followService.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!,
          ),
        );
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this._followService.getFolloweeCount(authToken, displayedUser),
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      const followerCount = await this._followService.getFollowerCount(
        authToken,
        displayedUser,
      );
      this.view.setFollowerCount(followerCount);
    }, "get followers");
  }

  public getBaseUrl = (pathname: string): string => {
    const segments = pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };

  public followDisplayedUser = async (
    displayedUser: User,
    authToken: AuthToken,
  ): Promise<void> => {
    await this.doDisplayedUserAction(
      displayedUser,
      authToken,
      "Following",
      (authToken: AuthToken, displayedUser: User) =>
        this._followService.follow(authToken, displayedUser),
      "follow user",
      true
    );
  };

  public unfollowDisplayedUser = async (
    displayedUser: User,
    authToken: AuthToken,
  ): Promise<void> => {
    await this.doDisplayedUserAction(
      displayedUser,
      authToken,
      "Unfollowing",
      (authToken: AuthToken, displayedUser: User) =>
        this._followService.unfollow(authToken, displayedUser),
      "unfollow user",
      false
    );
  };

  private async doDisplayedUserAction(
    displayedUser: User,
    authToken: AuthToken,
    action: string,
    displayedUserAction: (
      authToken: AuthToken,
      displayedUser: User,
    ) => Promise<[followerCount: number, followeeCount: number]>,
    itemDescription: string,
    toFollow: boolean
  ): Promise<void> {
    var followingUserToast = "";
    try {
      await this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);
        followingUserToast = this.view.displayInfoMessage(
          `${action} ${displayedUser.name}...`,
          0,
        );

        const [followerCount, followeeCount] = await displayedUserAction(
          authToken!,
          displayedUser!,
        );

        this.view.setIsFollower(toFollow);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      }, itemDescription);
    } finally {
      this.view.deleteMessage(followingUserToast);
      this.view.setIsLoading(false);
    }
  }
}
