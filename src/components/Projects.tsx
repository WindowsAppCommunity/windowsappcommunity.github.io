import * as React from "react";
import { Stack } from "office-ui-fabric-react";
import { SubHeader } from "./app/SubHeader";
import { List } from "./projects/List";
import ProjectList from '../common/projectList.json';

export const Projects: React.StatelessComponent = () => {
  // let subTitle = `Total: ${ProjectList.projects.length}`;
  
  return (
    <Stack horizontalAlign="center">
      <SubHeader title="Projects //" subTitle={ProjectList.projects.length.toString()} />
      <List projects={ProjectList}/>
    </Stack>
  );
};
