import { useMessageActions } from "../toaster/MessageHooks";
import { OverlayTrigger } from "react-bootstrap";
import { Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface Props {
    thirdPartyName: string;
    iconProp: IconProp;
}

const OAuthButton = (props: Props) => {
    const lowerCaseThirdParty = props.thirdPartyName.toLowerCase();

    const { displayInfoMessage } = useMessageActions();
    
        const displayInfoMessageWithDarkBackground = (message: string): void => {
            displayInfoMessage(
              message,
              3000,
              "text-white bg-primary"
            );
        };

    return (
        <>
        <button
              type="button"
              className="btn btn-link btn-floating mx-1"
              onClick={() =>
                displayInfoMessageWithDarkBackground(
                  `${props.thirdPartyName} registration is not implemented.`
                )
              }
            >
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`${lowerCaseThirdParty}Tooltip`}>{props.thirdPartyName}</Tooltip>}
              >
                <FontAwesomeIcon icon={props.iconProp} />
              </OverlayTrigger>
            </button>
        </>
    )
}

export default OAuthButton;