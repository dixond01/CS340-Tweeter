import { Status } from "tweeter-shared";
import Post from "./Post";
import { Item } from "../Item";

interface Props {
  item: Status;
  featurePath: string;
}

const StatusItem = (props: Props) => {
  const statusItemSection = (
    <>
      {props.item.formattedDate}
      <br />
      <Post status={props.item} featurePath={props.featurePath} />
    </>
  );

  return (
    <Item
      user={props.item.user}
      featurePath={props.featurePath}
      statusItemSection={statusItemSection}
    />
  );
};

export default StatusItem;
