import * as React from "react";
import { Stack, Text, FontIcon } from "office-ui-fabric-react";
import { GetAllProjects, IProject } from "../common/services/projects";
import { ProjectCard } from "../components/ProjectCard";
import { PromiseVisualizer } from "../components/PromiseVisualizer";
import { GetCurrentDiscordUser, GetUserRoles } from "../common/services/discord";

export const Projects = () => {
  const [state, setState] = React.useState<IProject[]>();
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);

  React.useEffect(() => {
    setupUserRoles();
  }, []);

  async function setupUserRoles() {
    var currentUser = await GetCurrentDiscordUser();
    if (!currentUser)
      return;

    var currentUserRoles = await GetUserRoles(currentUser);
    if (!currentUserRoles)
      return;

    setIsAdmin(currentUserRoles.filter(x => x == "Admin").length > 0);
  }

  return (
    /* Todo: Add a header with brief explanation of the below */
    <Stack horizontalAlign="center" horizontal wrap tokens={{ childrenGap: 10 }}>
      <PromiseVisualizer promise={GetAllProjects()} onResolve={setState} loadingMessage='Loading Projects...' loadingStyle={{ padding: 25 }} errorStyle={{ padding: 25 }}>
        {state && (
          state.length > 0 ? state.sort((a, b) => a.appName.localeCompare(b.appName)).map((project, i) => (
            <ProjectCard key={i} onProjectRemove={project => setState(state.filter(p => p.appName !== project.appName))} project={project} editable={isAdmin}></ProjectCard>
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
