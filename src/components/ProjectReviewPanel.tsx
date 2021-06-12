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

interface IProjectReviewPanelProps {
    type: ReviewType;
}

export enum ReviewType {
    ManualReview, Launch
}

export const ProjectReviewPanel = (props: IProjectReviewPanelProps) => {
    const [state, setState] = React.useState<IProjectReviewPanelState>({ promise: GetAllProjects_Unfiltered() });

    function setProjectData(proj: IProject[]) {
        switch (props.type) {
            case ReviewType.ManualReview:
                proj = proj.filter(proj => proj.needsManualReview); break;
            case ReviewType.Launch:
                proj = proj.filter(proj => proj.awaitingLaunchApproval && !proj.needsManualReview); break;
        }
        if (!state.data) setState({ ...state, data: proj });
    }

    function removeProject(project: IProject) {
        // Disabled. Some bug (in React possibly?) is causing it to only remove the last item in the list, rather than updating with the new list we give it here. 
        return;
        setState({
            ...state, data: state.data?.filter(p => p.id != project.id)
        });

        setState(state);
    }

    return (
            <Stack wrap horizontal tokens={{ childrenGap: 10 }} horizontalAlign="center">
                <PromiseVisualizer promise={state.promise} onResolve={setProjectData} loadingMessage='Loading Projects...' loadingStyle={{ padding: 25 }} errorStyle={{ padding: 25 }}>
                    {state && (state.data && state.data.length > 0 ? state.data.map((project, i) => (
                        <ProjectCard modOptions editable key={i} project={project} onProjectRemove={removeProject} />
                    )) : (
                        <Stack horizontalAlign="center" verticalAlign="center" tokens={{ padding: 20 }}>
                            <FontIcon iconName="sad" style={{ fontSize: 55 }}></FontIcon>
                            <Text variant="xLarge">{(() => {
                                switch (props.type) {
                                    case ReviewType.Launch: return "No submissions";
                                    case ReviewType.ManualReview: return "Nothing to review";
                                    default: return "No projects, yet"
                                }
                            })()}</Text>
                        </Stack>
                    )
                    )}
                </PromiseVisualizer>
            </Stack>
        )
    };