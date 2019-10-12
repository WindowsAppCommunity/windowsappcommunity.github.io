import * as React from "react";
import { IProject, GetAllProjects_Unfiltered } from "../common/services/projects";
import { Stack, Text } from "office-ui-fabric-react";
import { ProjectCard } from "./ProjectCard";

export const ProjectApprovalPanel = () => {
    const [viewModel, setViewModel] = React.useState<IProject[]>([]);

    React.useEffect(() => {
        GetAllProjects_Unfiltered()
            .then(setViewModel)
    });

    return (
        <Stack horizontalAlign="center" tokens={{ childrenGap: 20 }}>
            <Text variant="xLarge">Pending review</Text>
            <Stack wrap horizontal tokens={{ childrenGap: 15 }} horizontalAlign="space-evenly">
                {viewModel.map(project => { if (project.needsManualReview) return <ProjectCard project={project} /> })}
            </Stack>
        </Stack>
    )
};