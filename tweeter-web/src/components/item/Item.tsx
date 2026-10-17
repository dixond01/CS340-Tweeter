import { User } from "tweeter-shared";
import useUserNavigation from "../userNavigation/UserNavigationHook";
import { Link } from "react-router-dom";

interface Props {
  user: User;
  featurePath: string;
  statusItemSection?: JSX.Element;
}

export const Item = (props: Props) => {
  const { navigateToUser } = useUserNavigation();

  return (
    <>
      <div className="col bg-light mx-0 px-0">
        <div className="container px-0">
          <div className="row mx-0 px-0">
            <div className="col-auto p-3">
              <img
                src={props.user.imageUrl}
                className="img-fluid"
                width="80"
                alt="Posting user"
              />
            </div>
            <div className="col">
              <h2>
                <b>
                  {props.user.firstName} {props.user.lastName}
                </b>{" "}
                -{" "}
                <Link
                  to={`${props.featurePath}/${props.user.alias}`}
                  onClick={async (event) =>
                    await navigateToUser(event, props.featurePath)
                  }
                >
                  {props.user.alias}
                </Link>
              </h2>
              {props.statusItemSection}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
