import { OverlayTrigger } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Tooltip } from "react-bootstrap"
import { useMessageActions } from "../toaster/MessageHooks";
import OAuthButton from "./OAuthButton";

const OAuth = () => {
    return (
        <>
        <div className="text-center mb-3">
          <OAuthButton thirdPartyName="Google" iconProp={["fab", "google"]}/>
          <OAuthButton thirdPartyName="Facebook" iconProp={["fab", "facebook"]}/>
          <OAuthButton thirdPartyName="Twitter" iconProp={["fab", "twitter"]}/>
          <OAuthButton thirdPartyName="LinkedIn" iconProp={["fab", "linkedin"]}/>
          <OAuthButton thirdPartyName="GitHub" iconProp={["fab", "github"]}/>
          </div>
        </>
    );
}

export default OAuth