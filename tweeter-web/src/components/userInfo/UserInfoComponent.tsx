import "./UserInfoComponent.css";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "./UserInfoHooks";
import {
  UserInfoPresenter,
  UserInfoView,
} from "../../presenter/UserInfoPresenter";
import { FollowActionButton } from "./FollowActionButton";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { displayErrorMessage, displayInfoMessage, deleteMessage } =
    useMessageActions();

  const { currentUser, authToken, displayedUser } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const location = useLocation();

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  const listener: UserInfoView = {
    setIsFollower: setIsFollower,
    setFollowerCount: setFollowerCount,
    setFolloweeCount: setFolloweeCount,
    displayErrorMessage: displayErrorMessage,
    displayInfoMessage: displayInfoMessage,
    deleteMessage: deleteMessage,
    setIsLoading: setIsLoading,
  };

  const presenterRef = useRef<UserInfoPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UserInfoPresenter(listener);
  }

  useEffect(() => {
    presenterRef.current!.setIsFollowerStatus(
      authToken!,
      currentUser!,
      displayedUser!,
    );
    presenterRef.current!.setNumbFollowees(authToken!, displayedUser!);
    presenterRef.current!.setNumbFollowers(authToken!, displayedUser!);
  }, [displayedUser]);

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    setDisplayedUser(currentUser!);
    navigate(
      `${presenterRef.current!.getBaseUrl(location.pathname)}/${currentUser!.alias}`,
    );
  };

  const followDisplayedUser = async (
    event: React.MouseEvent,
  ): Promise<void> => {
    event.preventDefault();
    await presenterRef.current!.followDisplayedUser(displayedUser!, authToken!);
  };

  const unfollowDisplayedUser = async (
    event: React.MouseEvent,
  ): Promise<void> => {
    event.preventDefault();
    await presenterRef.current!.unfollowDisplayedUser(
      displayedUser!,
      authToken!,
    );
  };

  return (
    <>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {!displayedUser.equals(currentUser) && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={`./${currentUser.alias}`}
                    onClick={switchToLoggedInUser}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeeCount > -1 && followerCount > -1 && (
                <div>
                  Followees: {followeeCount} Followers: {followerCount}
                </div>
              )}
            </div>
            <form>
              {!displayedUser.equals(currentUser) && (
                <div className="form-group">
                  {isFollower ? (
                    <FollowActionButton
                      id="unFollowButton"
                      btnLevel="secondary"
                      isLoading={isLoading}
                      followAction={unfollowDisplayedUser}
                      label="Unfollow"
                    />
                  ) : (
                    <FollowActionButton
                      id="followButton"
                      btnLevel="primary"
                      isLoading={isLoading}
                      followAction={followDisplayedUser}
                      label="Follow"
                    />
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
