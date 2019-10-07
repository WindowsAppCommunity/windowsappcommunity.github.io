import * as React from "react";
import { Stack, Text, FontIcon, Spinner, ProgressIndicator } from "office-ui-fabric-react";
import { useProjects } from "../common/services/projects";
import { ProjectCard } from "../components/ProjectCard";

export const Projects: React.StatelessComponent = () => {
  const [state, getProjects] = useProjects();

  React.useEffect(() => {
    getProjects();
  }, []);

  return (
    /* Todo: Add a header with brief explanation of the below */
    <>
      <Stack horizontalAlign="center" horizontal wrap tokens={{ childrenGap: 10 }}>
        {!state.projects && state.isLoading &&
          <Stack horizontalAlign="center" style={{ marginTop: "25vh" }}>
            <Spinner label="Loading Projects..." />
          </Stack>
        }
        {state.error && (
          <Stack horizontalAlign="center" style={{ marginTop: "25vh" }}>
            <FontIcon iconName="sad" style={{ fontSize: 55 }}></FontIcon>
            <Text variant="xLarge">An error occured getting projects</Text>
          </Stack>      
        )}
        {state.projects && (
          state.projects.length > 0 ? state.projects.map((project, i) => (
            <ProjectCard key={i} project={project}></ProjectCard>
          )) : (
            <Stack horizontalAlign="center" style={{ marginTop: "25vh" }}>
              <FontIcon iconName="sad" style={{ fontSize: 55 }}></FontIcon>
              <Text variant="xLarge">No projects, yet</Text>
            </Stack>
          )
        )}
      </Stack>
      
      {state.projects && state.isLoading && (
        <ProgressIndicator />
      )}
    </>
  );
};
