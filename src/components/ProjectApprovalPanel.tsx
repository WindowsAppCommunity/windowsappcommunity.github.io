import * as React from "react";
import { IProject, GetAllProjects_Unfiltered } from "../common/services/projects";
import { Stack, Text } from "office-ui-fabric-react";
import { ProjectCard } from "./ProjectCard";
import { PromiseVisualizer } from "./PromiseVisualizer";

export const ProjectApprovalPanel = () => {
    const [viewModel, setViewModel] = React.useState<IProject[]>([]);

    return (
        <Stack horizontalAlign="center" tokens={{ childrenGap: 20 }}>
            <Text variant="xLarge">Pending review</Text>
            <PromiseVisualizer promise={GetAllProjects_Unfiltered()} onResolve={setViewModel} loadingMessage='Loading...' loadingStyle={{ marginTop: "25vh" }} errorStyle={{ marginTop: "25vh" }}>
                <Stack wrap horizontal tokens={{ childrenGap: 15 }} horizontalAlign="space-evenly">
                    {viewModel.map(project => { if (project.needsManualReview) return <ProjectCard project={project} /> })}
                </Stack>
            </PromiseVisualizer>
        </Stack>
    )
};