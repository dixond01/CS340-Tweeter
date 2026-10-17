interface Props {
  id: string;
  btnLevel: string;
  isLoading: boolean;
  followAction: (event: React.MouseEvent<Element, MouseEvent>) => void;
  label: string;
}

export const FollowActionButton = (props: Props) => {
  return (
    <button
      id={props.id}
      className={`btn btn-md btn-${props.btnLevel} me-1`}
      type="submit"
      style={{ width: "6em" }}
      disabled={props.isLoading}
      onClick={props.followAction}
    >
      {props.isLoading ? (
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
      ) : (
        <div>{props.label}</div>
      )}
    </button>
  );
};
