import { Text, Stack, PrimaryButton, TextField, DefaultButton, TooltipHost, IconButton, Icon, ITheme, createTheme, Separator, BaseButton, Spinner, SpinnerSize, DialogType, DialogFooter, Dialog, Modal } from "office-ui-fabric-react";
import React from "react";
import { IBackendReponseError } from "../common/interfaces";
import { CreateUser, GetUserProjects, IUser, ModifyUser } from "../common/services/users";
import { CurrentUser } from "../common/services/discord";
import { fetchBackend } from "../common/helpers";
import { ProjectCard } from './ProjectCard';
import { IProject, IProjectCollaborator } from "../common/services/projects";
import styled from "styled-components";

export interface IRoleManagerProps {
    discordId: string;
};

interface IRoleManagerProject {
    project: IProject;
    collaborator: IProjectCollaborator;
}

interface IRoleGroups {
    [key: string]: IRoleManagerProject[];
}

export const RoleManager = (props: IRoleManagerProps) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");
    const [projects, setProjects] = React.useState<IProject[]>([]);

    let [groupedProjects, setGroupedProjects] = React.useState<IRoleGroups>({
        "Developer": [],
        "Translator": [],
        "Beta Tester": [],
        "Other": [],
        "Advocate": [],
        "Lead": [],
        "Support": [],
    });

    React.useEffect(() => {
        getUserApps(props.discordId);
    }, []);

    async function removeCollaborator(projectId: number, role: string) {
        const removeCollaboratorReq = await fetchBackend(`projects/collaborators`, "DELETE", {
            discordId: props.discordId,
            role: role,
            projectId: projectId,
        });

        if (removeCollaboratorReq.status !== 200) {
            setError("Error while removing collaborator. " + (await removeCollaboratorReq.json()).reason || removeCollaboratorReq.statusText);
            return;
        }

        removeProjectFromView(role, projectId);
    }

    function removeProjectFromView(role: string, projectId: number) {
        const newGrouping = { ...groupedProjects };

        var originalSize = newGrouping[role].length;

        newGrouping[role] = newGrouping[role].filter(x => x.project.id != projectId);

        if (newGrouping[role].length == originalSize) {
            setError("Internal error: tried removing a project that doesn't exist.");
            return;
        }

        setGroupedProjects(newGrouping);

        setProjects(projects.filter(x => x.id != projectId));
    }

    async function getUserApps(discordId: string) {
        setLoading(true);

        const projects = await GetUserProjects(discordId);
        setProjects(projects);

        if (projects.length == 0) {
            setLoading(false);
            return;
        }

        for (const proj of projects) {
            const projectCollaboratorsReq = await fetchBackend(`projects/collaborators?projectId=${proj.id}`, "GET");
            if (projectCollaboratorsReq.status !== 200) {
                console.error(`Unable to retrieve project collaborators for ${proj.appName} (id ${proj.id})`);
                return;
            }

            var json = await projectCollaboratorsReq.json();
            setLoading(false);

            const collaborators = json as IProjectCollaborator[];
            proj.collaborators = collaborators;

            for (const collaborator of collaborators) {
                if (collaborator.discordId != discordId)
                    continue;

                const newGrouping = { ...groupedProjects };

                if (newGrouping[collaborator.role].includes({ project: proj, collaborator: collaborator }))
                    continue;

                newGrouping[collaborator.role].push({ project: proj, collaborator: collaborator });

                setGroupedProjects(newGrouping);
            }
        }
    }

    const separatorTheme: ITheme = createTheme({
        fonts: {
            medium: {
                fontSize: '20px',
            },
        },
    });

    return (
        <Stack tokens={{ childrenGap: 15 }}>

            {(
                (error != "" ?
                    <Stack>
                        <Text>{error}</Text>
                        <PrimaryButton onClick={() => setError("")}>OK</PrimaryButton>
                    </Stack> :

                    loading ?
                        <Spinner label="Loading..." size={SpinnerSize.large} />
                        :

                        projects.length == 0 ?
                            <Stack horizontalAlign="center">
                                <Separator theme={separatorTheme}>Nothing to show!</Separator>
                                <Text style={{ marginTop: 10 }}>You aren't collaborating on anything</Text>
                                <Text variant="xSmall">or haven't registered your own projects for collaboration</Text>
                            </Stack>
                            :
                            (Object.entries(groupedProjects).map(([key, projects], i) =>
                            (
                                projects.length == 0 ? <div key={"RoleManagerSection" + key + i} /> :
                                    <Stack tokens={{ childrenGap: 10 }} key={"RoleManagerSection" + key + i}>
                                        <Separator theme={separatorTheme}>{key}</Separator>
                                        <Stack horizontal wrap tokens={{ childrenGap: 10 }}>
                                            {(
                                                projects.map((collaborativeProject, i) =>
                                                    <Stack horizontalAlign="end" key={"roleManagerItem" + collaborativeProject.project.id + collaborativeProject.collaborator.role}>

                                                        <BaseButton style={{ width: 25, padding: 0, backgroundColor: "transparent", outline: "none", borderColor: "transparent" }} disabled={collaborativeProject.collaborator.isOwner}
                                                            onClick={() => {
                                                                if (window.confirm(`You may lose access to channels or services for to this project, and will need to be re-added by a project manager to regain access.\n\nRole will be removed. Are you sure?`)) {
                                                                    removeCollaborator(collaborativeProject.project.id, key);
                                                                }
                                                            }}>
                                                            <Icon iconName="Cancel" style={{ fontSize: 14, padding: 3 }}
                                                                title={collaborativeProject.collaborator.isOwner ? "You own this project and cannot remove this role." : "Remove this role"} ariaLabel="Remove role" />
                                                        </BaseButton>

                                                        <Stack style={{ marginTop: 5, zIndex: 1 }}>
                                                            <ProjectCard editable={collaborativeProject.collaborator.isOwner} project={collaborativeProject.project} onProjectRemove={(project) => { removeProjectFromView(key, project.id); }} />
                                                        </Stack>
                                                    </Stack>
                                                )
                                            )}
                                        </Stack>
                                    </Stack>
                            )
                            ))))}
        </Stack>
    )
};