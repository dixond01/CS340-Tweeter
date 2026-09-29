import { Link, useNavigate } from "react-router-dom";
import { AuthToken, FakeData, Status, Type, User } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";

const useUserNavigation = () => {
    const { authToken, displayedUser } = useUserInfo();
    const { setDisplayedUser } = useUserInfoActions();
    const { displayErrorMessage } = useMessageActions();
    const navigate = useNavigate();

    const navigateToUser = async (event: React.MouseEvent, featurePath: string ): Promise<void> => {
        event.preventDefault();

        try {
            const alias = extractAlias(event.target.toString());

            const toUser = await getUser(authToken!, alias);

            if (toUser) {
                if (!toUser.equals(displayedUser!)) {
                    setDisplayedUser(toUser);
                    navigate(`${featurePath}/${toUser.alias}`);
                }
            }
        } catch (error) {
            displayErrorMessage(
                `Failed to get user because of exception: ${error}`
            );
        }
    };

    const extractAlias = (value: string): string => {
        const index = value.indexOf("@");
        return value.substring(index);
    };

    const getUser = async (
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> => {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
    };

    return {
        navigateToUser: (event: React.MouseEvent, featurePath: string) => navigateToUser(event, featurePath),
        getUser: (authToken: AuthToken, alias: string) => getUser(authToken, alias)
    };

}

export default useUserNavigation;

