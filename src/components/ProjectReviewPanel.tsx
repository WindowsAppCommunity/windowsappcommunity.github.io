import * as React from "react";
import { IProject, GetAllProjects_Unfiltered } from "../common/services/projects";
import { Stack, Text, FontIcon } from "office-ui-fabric-react";
import { ProjectCard } from "./ProjectCard";
import { PromiseVisualizer } from "./PromiseVisualizer";

interface IProjectReviewPanelState {
    promise: Promise<IProject[]>;
    data?: IProject[];
    onPromiseFullfilled?: () => {}
}

export const ProjectReviewPanel = () => {
    const [state, setState] = React.useState<IProjectReviewPanelState>({ promise: GetAllProjects_Unfiltered() });

    function setApproveableProjects(proj: IProject[]) {
        if(!state.data) setState({ ...state, data: proj.filter(proj => proj.needsManualReview) });
    }

    return (
        <Stack horizontalAlign="center" tokens={{ childrenGap: 20 }}>
            <Text variant="xLarge">Pending review</Text>
            <Stack wrap horizontal tokens={{ childrenGap: 10 }}>
                <PromiseVisualizer promise={state.promise} onResolve={setApproveableProjects} loadingMessage='Loading Projects...' loadingStyle={{ marginTop: "25vh" }} errorStyle={{ marginTop: "25vh" }}>
                    {state && (state.data && state.data.length > 0 ? state.data.map((project, i) => (
                        <ProjectCard modOptions editable key={i} project={project}></ProjectCard>
                    )) : (
                            <Stack horizontalAlign="center" >
                                <FontIcon iconName="sad" style={{ fontSize: 55 }}></FontIcon>
                                <Text variant="xLarge">No projects, yet</Text>
                            </Stack>
                        )
                    )}
                </PromiseVisualizer>
            </Stack>
        </Stack>
    )
};