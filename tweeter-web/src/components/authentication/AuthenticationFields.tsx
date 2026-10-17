import { useState } from "react";
import { InputField } from "./InputField";

interface Props {
  eventOnEnter: (event: React.KeyboardEvent<HTMLElement>) => void;
  setAlias: (value: string) => void;
  setPassword: (value: string) => void;
}

const AuthenticationFields = (props: Props) => {
  return (
    <>
      <InputField
        id="aliasInput"
        placeholder="name@example.com"
        eventOnEnter={props.eventOnEnter}
        setter={props.setAlias}
        label="Alias"
      />
      <InputField
        id="passwordInput"
        placeholder="Password"
        eventOnEnter={props.eventOnEnter}
        setter={props.setPassword}
        label="Password"
      />
    </>
  );
};

export default AuthenticationFields;
