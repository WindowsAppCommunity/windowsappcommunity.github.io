import * as React from "react";
import { Stack } from "office-ui-fabric-react";
import { Header } from "./projects/Header";
import { List } from "./projects/List";
import ProjectList from '../common/projectList.json';

export const Projects: React.StatelessComponent = () => {
  return (
    <Stack horizontalAlign="center">
      <Header a="" b="" />
      <List projects={ProjectList}/>
    </Stack>
  );
};
