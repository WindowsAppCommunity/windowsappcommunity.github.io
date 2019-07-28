import React from "react";
import { ProjectList } from "../../common/interfaces";
import { ListItem } from "./ListItem";
import { Stack, IStackTokens, IStackStyles } from "office-ui-fabric-react";

interface ListProps {
  projects: ProjectList;
}


const stackStyles: IStackStyles = {
  root: {
    width: "90%",
    alignContent: "center"
  }
};

const wrapStackTokens: IStackTokens = { childrenGap: 30 };


export const List = (props: ListProps) => {
  const items = props.projects.projects.map((item) => (
    <ListItem project={item} />
  ));

  return (
    <Stack horizontal wrap styles={stackStyles} tokens={wrapStackTokens} horizontalAlign="center">
      {items}
    </Stack>
  );
};
