import * as React from "react";
import { Stack, Text } from "office-ui-fabric-react";
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
      {projects ? projects.map(project => {
        return (
          <ProjectCard project={project}></ProjectCard>
        )
      }) : <> </>}
    </Stack>
  );
};
