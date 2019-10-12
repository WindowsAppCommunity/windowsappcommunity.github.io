import * as React from "react";
import { IProject, GetLaunchProjects, GetAllProjects } from "../common/services/projects";

export const ProjectApprovalPanel = () => {
    const [viewModel, setViewModel] = React.useState<IProject[]>([]);

    React.useEffect(() => {
        GetAllProjects()
    });

    return (
        <></>
    )
};