import React from "react";
import { FormControl, Select } from "@material-ui/core";

interface SelectorProps {
  width: string;
  selRef: React.RefObject<HTMLInputElement>;
  selValue: string;
  change: (
    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>,
    child: React.ReactNode
  ) => void;
}

const Selector: React.FC<SelectorProps> = (props) => {
  return (
    <FormControl style={{ width: props.width }}>
      <Select
        inputRef={props.selRef}
        value={props.selValue}
        onChange={props.change}
      >
        {props.children}
      </Select>
    </FormControl>
  );
};

export default Selector;
