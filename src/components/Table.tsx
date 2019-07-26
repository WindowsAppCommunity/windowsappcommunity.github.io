import * as React from "react";
import { Stack } from "office-ui-fabric-react";
import { TableHeader } from "./TableHeader";
import { TableList } from "./TableList";
import { TableFooter } from "./TableFooter";
import { ProjectListConst } from "../common/ProjectList";

export const Table: React.StatelessComponent = () => {
  return (
    <Stack horizontalAlign="center">
      <TableHeader a="a" b="b" />
      <TableList projects={ProjectListConst} />
      <TableFooter a="a" b="b" />
    </Stack>
  );
};
