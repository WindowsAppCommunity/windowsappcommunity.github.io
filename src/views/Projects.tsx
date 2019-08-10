import * as React from "react";
import { Stack } from "office-ui-fabric-react";
import { ProjectList as ProjectListElement } from "../components/ProjectList";
import ProjectList from '../assets/projectList.json';

export const Projects: React.StatelessComponent = () => {
  return (
    /* Todo: Add a header with brief explanation of the below */
    <Stack horizontalAlign="center">
      <ProjectListElement projects={ProjectList} />
    </Stack>
  );
};
