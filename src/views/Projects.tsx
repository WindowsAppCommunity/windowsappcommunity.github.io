import * as React from "react";
import { Stack, Text, FontIcon } from "office-ui-fabric-react";
import { GetAllProjects } from "../common/services/projects";
import { ProjectCard } from "../components/ProjectCard";
import { PromiseVisualizer, useStatePromise } from "../components/PromiseVisualizer";

export const Projects: React.StatelessComponent = () => {
  const [state, setState] = useStatePromise(GetAllProjects());

  return (
    /* Todo: Add a header with brief explanation of the below */
    <Stack horizontalAlign="center" horizontal wrap tokens={{ childrenGap: 10 }}>
      <PromiseVisualizer hook={[state, setState]} loadingMessage='Loading Projects...' loadingStyle={{ marginTop: "25vh" }} errorStyle={{ marginTop: "25vh" }}>
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
      </PromiseVisualizer>
    </Stack>
  );
};
