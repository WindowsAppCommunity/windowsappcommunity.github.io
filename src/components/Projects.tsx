import * as React from "react";
import { Stack } from "office-ui-fabric-react";
import { SubHeader } from "./app/SubHeader";
import { List } from "./projects/List";
import ProjectList from '../common/projectList.json';

export const Projects: React.StatelessComponent = () => {
  let subTitle = `A list of the UWP Community Projects, Total: ${ProjectList.projects.length}`
  return (
    <Stack horizontalAlign="center">
      <SubHeader title="Projects //" subTitle={subTitle} />
      <List projects={ProjectList}/>
    </Stack>
  );
};
