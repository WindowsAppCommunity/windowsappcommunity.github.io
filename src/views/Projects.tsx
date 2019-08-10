import * as React from "react";
import { Stack } from "office-ui-fabric-react";
import { SubHeader } from "../components/app/SubHeader";
import { ProjectList as ProjectListElement } from "../components/projects/ProjectList";
import ProjectList from '../common/projectList.json';

export const Projects: React.StatelessComponent = () => {
  // let subTitle = `Total: ${ProjectList.projects.length}`;
  
  return (
    <Stack horizontalAlign="center">
      {/* <SubHeader title="Projects //" subTitle={ProjectList.projects.length.toString()} /> */}
      
      <ProjectListElement projects={ProjectList} />
    </Stack>
  );
};
