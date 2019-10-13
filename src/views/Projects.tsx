import * as React from "react";
import { Stack, Text, FontIcon, Spinner, ProgressIndicator } from "office-ui-fabric-react";
import { useProjects } from "../common/services/projects";
import { ProjectCard } from "../components/ProjectCard";
import { LoadingWrapper } from "../components/LoadingWrapper";

export const Projects: React.StatelessComponent = () => {
  const [state, getProjects] = useProjects();

  React.useEffect(() => {
    getProjects();
  }, []);

  return (
    /* Todo: Add a header with brief explanation of the below */
    <Stack horizontalAlign="center" horizontal wrap tokens={{ childrenGap: 10 }}>
      <LoadingWrapper loadingMessage='Loading Projects...' loadingStyle={{ marginTop: "25vh" }} isReady={!state.isLoading}>
        {state.error && (
          <Stack horizontalAlign="center" style={{ marginTop: "25vh" }}>
            <FontIcon iconName="sad" style={{ fontSize: 55 }}></FontIcon>
            <Text variant="xLarge">An error occured getting projects</Text>
          </Stack>
        )}
        {state.results && (
          state.results.length > 0 ? state.results.map((project, i) => (
            <ProjectCard key={i} project={project}></ProjectCard>
          )) : (
              <Stack horizontalAlign="center" style={{ marginTop: "25vh" }}>
                <FontIcon iconName="sad" style={{ fontSize: 55 }}></FontIcon>
                <Text variant="xLarge">No projects, yet</Text>
              </Stack>
            )
        )}
      </LoadingWrapper>
    </Stack>
  );
};
