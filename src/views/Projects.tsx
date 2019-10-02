import * as React from "react";
import { Stack, Text, FontIcon } from "office-ui-fabric-react";
import { GetAllProjects, IProject } from "../common/services/projects";
import { ProjectCard } from "../components/ProjectCard";

export const Projects: React.StatelessComponent = () => {
  const [projects, setProjects] = React.useState<IProject[]>();

  async function PopulateProjects() {
    const projectsApi = await GetAllProjects();
    setProjects(projectsApi);
  }

  PopulateProjects();

  return (
    /* Todo: Add a header with brief explanation of the below */
    <Stack horizontalAlign="center" horizontal wrap tokens={{ childrenGap: 10 }}>
      {projects && projects.length > 0 ? projects.map(project => {
        return (
          <ProjectCard project={project}></ProjectCard>
        )
      }) :
        <Stack horizontalAlign="center" style={{ marginTop: "25vh" }}>
          <FontIcon iconName="sad" style={{ fontSize: 55 }}></FontIcon>
          <Text variant="xLarge">No projects, yet</Text>
        </Stack>
      }
    </Stack>
  );
};
