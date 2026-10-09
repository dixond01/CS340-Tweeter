import { useCallback, useMemo, useRef, useState } from "react";
import { User, AuthToken } from "tweeter-shared";
import { UserInfoContext, UserInfoActionsContext } from "./UserInfoContexts";
import { UserInfoProviderPresenter } from "../../presenter/UserInfoProviderPresenter";

interface Props {
  children: React.ReactNode;
}

const UserInfoProvider: React.FC<Props> = ({ children }) => {
  const presenterRef = useRef<UserInfoProviderPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UserInfoProviderPresenter();
  }

  const [userInfo, setUserInfo] = useState({
    ...presenterRef.current!.retrieveFromLocalStorage(),
  });

  const updateUserInfo = useCallback(
    (
      currentUser: User,
      displayedUser: User | null,
      authToken: AuthToken,
      remember: boolean = false,
    ) => {
      setUserInfo(() => {
        return {
          currentUser: currentUser,
          displayedUser: displayedUser,
          authToken: authToken,
        };
      });

      if (remember) {
        presenterRef.current!.saveToLocalStorage(currentUser, authToken);
      }
    },
    [],
  );

  const clearUserInfo = useCallback(() => {
    setUserInfo(() => {
      return {
        currentUser: null,
        displayedUser: null,
        authToken: null,
      };
    });

    presenterRef.current!.clearLocalStorage();
  }, []);

  const setDisplayedUser = useCallback((user: User) => {
    setUserInfo((previous) => {
      return { ...previous, displayedUser: user };
    });
  }, []);

  const userInfoActions = useMemo(
    () => ({
      updateUserInfo,
      clearUserInfo,
      setDisplayedUser,
    }),
    [updateUserInfo, clearUserInfo, setDisplayedUser],
  );

  return (
    <UserInfoContext.Provider value={userInfo}>
      <UserInfoActionsContext.Provider value={userInfoActions}>
        {children}
      </UserInfoActionsContext.Provider>
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;
