import * as React from "react";
import { Stack } from "office-ui-fabric-react";
import { TableHeader } from "./TableHeader";
import { TableList } from "./TableList";
import { TableFooter } from "./TableFooter";

import ProjectList from '../common/projectList.json';
// export const ProjectListConst: ProjectList = myData;

export const Table: React.StatelessComponent = () => {
  return (
    <Stack horizontalAlign="center">
      <TableHeader a="" b="" />
      <TableList projects={ProjectList}/>
      <TableFooter a="" b="" />
    </Stack>
  );
};
