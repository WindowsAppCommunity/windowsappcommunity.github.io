import React from "react";
import { ProjectList } from "../common/interfaces";
import { TableListItem } from "./TableListItem";
import { Stack, IStackTokens, IStackStyles } from "office-ui-fabric-react";

interface TableListProps {
  projects: ProjectList;
}


const stackStyles: IStackStyles = {
  root: {
    width: "90%",
    alignContent: "center"
  }
};

const wrapStackTokens: IStackTokens = { childrenGap: 30 };


export const TableList = (props: TableListProps) => {
  const items = props.projects.projects.map((item) => (
    <TableListItem project={item} />
  ));

  return (
    <Stack horizontal wrap styles={stackStyles} tokens={wrapStackTokens} horizontalAlign="center">
      {items}
    </Stack>
  );
};
