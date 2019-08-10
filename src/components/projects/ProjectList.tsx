import React from "react";
import { IProjectList } from "../../common/interfaces";
import { ProjectCard } from "./ProjectCard";
import { Stack, IStackTokens, IStackStyles } from "office-ui-fabric-react";

interface ListProps {
  projects: IProjectList;
}


const stackStyles: IStackStyles = {
  root: {
    width: "90%",
    alignContent: "center"
  }
};

const wrapStackTokens: IStackTokens = { childrenGap: 30 };


export const ProjectList = (props: ListProps) => {
  const items = props.projects.projects.map((item) => (
    <ProjectCard key={item.id} project={item} />
  ));

  return (
    <Stack horizontal wrap styles={stackStyles} tokens={wrapStackTokens} horizontalAlign="center">
      {items}
    </Stack>
  );
};
