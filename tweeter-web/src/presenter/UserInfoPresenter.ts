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
    this.doFailureReportingOperation(async () => {
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
    this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this._followService.getFolloweeCount(authToken, displayedUser),
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this._followService.getFollowerCount(authToken, displayedUser),
      );
    }, "get followers");
  }

  public getBaseUrl = (pathname: string): string => {
    const segments = pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };

  followDisplayedUser = async (
    displayedUser: User,
    authToken: AuthToken,
  ): Promise<void> => {
    var followingUserToast = "";
    try {
      this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);
        followingUserToast = this.view.displayInfoMessage(
          `Following ${User.name}...`,
          0,
        );

        const [followerCount, followeeCount] = await this._followService.follow(
          authToken!,
          displayedUser!,
        );

        this.view.setIsFollower(true);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      }, "follow user");
    } finally {
      this.view.deleteMessage(followingUserToast);
      this.view.setIsLoading(false);
    }
  };

  unfollowDisplayedUser = async (
    displayedUser: User,
    authToken: AuthToken,
  ): Promise<void> => {
    var unfollowingUserToast = "";

    try {
      this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);
      unfollowingUserToast = this.view.displayInfoMessage(
        `Unfollowing ${displayedUser!.name}...`,
        0,
      );

      const [followerCount, followeeCount] = await this._followService.unfollow(
        authToken!,
        displayedUser!,
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
      }, "unfollow user");   
    } finally {
      this.view.deleteMessage(unfollowingUserToast);
      this.view.setIsLoading(false);
    }
  };
}
