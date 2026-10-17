import { User } from "tweeter-shared";
import { Item } from "../Item";

interface Props {
  user: User;
  featurePath: string;
}

const UserItem = (props: Props) => {
  return <Item user={props.user} featurePath={props.featurePath} />;
};

export default UserItem;
