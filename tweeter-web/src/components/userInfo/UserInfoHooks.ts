import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts"
import { useContext } from "react"

export const useUserInfo = () => {
    return useContext(UserInfoContext);
}

export const useUserInfoActions = () => {
    return useContext(UserInfoActionsContext);
}