import * as React from "react";
import { Stack, Text, FontIcon, Spinner, ProgressIndicator } from "office-ui-fabric-react";
import { useProjects } from "../common/services/projects";
import { ProjectCard } from "../components/ProjectCard";
import { PromiseWrapper } from "../components/PromiseWrapper";

export const Projects: React.StatelessComponent = () => {
  const [state, getProjects] = useProjects();

  return (
    /* Todo: Add a header with brief explanation of the below */
    <Stack horizontalAlign="center" horizontal wrap tokens={{ childrenGap: 10 }}>
      <PromiseWrapper hook={[state, getProjects]}
        loadingMessage='Loading Projects...' loadingStyle={{ marginTop: "25vh" }} 
        errorMessage='An error occured getting projects' errorStyle={{ marginTop: "25vh" }}>
        {state.results && (
          state.results.length > 0 ? state.results.map((project, i) => (
            <ProjectCard key={i} project={project}></ProjectCard>
          )) : (
              <Stack horizontalAlign="center" >
                <FontIcon iconName="sad" style={{ fontSize: 55 }}></FontIcon>
                <Text variant="xLarge">No projects, yet</Text>
              </Stack>
            )
        )}
      </PromiseWrapper>
    </Stack>
  );
};
