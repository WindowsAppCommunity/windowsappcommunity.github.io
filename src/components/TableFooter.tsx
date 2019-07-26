import React from "react";
import { Stack } from "office-ui-fabric-react";

interface TableFooterProps {
  a: string;
  b: string;
}

export const TableFooter = (props: TableFooterProps) => {
  return (
    <Stack horizontal horizontalAlign="space-between">
      Footer {props.a} {props.b}
    </Stack>
  );
};
