interface Props {
    id: string,
    placeholder: string,
    eventOnEnter: (event: React.KeyboardEvent<HTMLElement>) => void,
    setter: (value: string) => void,
    label: string
}

export const InputField = (props: Props) => {
    return (
        <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id={props.id}
            aria-label={props.label.toLowerCase()}
            placeholder={props.placeholder}
            onKeyDown={props.eventOnEnter}
            onChange={(event) => props.setter(event.target.value)}
          />
          <label htmlFor={props.id}>{props.label}</label>
        </div>
        </>
    )
}