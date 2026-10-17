import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { UserNavigationPresenter } from "../../presenter/UserNavigationPresenter";
import { useRef } from "react";

const useUserNavigation = () => {
  const { authToken, displayedUser } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();
  const navigate = useNavigate();

  const listener = {
    setDisplayedUser: setDisplayedUser,
    navigate: navigate,
    displayErrorMessage: displayErrorMessage,
  };

  const presenterRef = useRef<UserNavigationPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UserNavigationPresenter(listener);
  }

  const navigateToUser = async (
    event: React.MouseEvent,
    featurePath: string,
  ): Promise<void> => {
    event.preventDefault();
    await presenterRef.current!.navigateToUser(
      event.target.toString(),
      featurePath,
      authToken!,
      displayedUser!,
    );
  };

  return {
    navigateToUser: (event: React.MouseEvent, featurePath: string) =>
      navigateToUser(event, featurePath)
  };
};

export default useUserNavigation;
