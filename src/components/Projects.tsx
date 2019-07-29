import * as React from "react";
import { Stack } from "office-ui-fabric-react";
import { SUbHeader } from "./app/SUbHeader";
import { List } from "./projects/List";
import ProjectList from '../common/projectList.json';

export const Projects: React.StatelessComponent = () => {
  return (
    <Stack horizontalAlign="center">
      <SUbHeader title="Projects //" subTitle="A list of the UWP Community Projects" />
      <List projects={ProjectList}/>
    </Stack>
  );
};
