import { Text, Stack, PrimaryButton, TextField, DefaultButton, TooltipHost, IconButton, Icon, ITheme, createTheme, Separator, BaseButton, Spinner, SpinnerSize, DialogType, DialogFooter, Dialog, Modal, Image } from "office-ui-fabric-react";
import React from "react";
import { IBackendReponseError } from "../common/interfaces";
import { CreateUser, GetUserProjects, IUser, ModifyUser } from "../common/services/users";
import { CurrentUser, GetDiscordUser, GetUserAvatar, IDiscordUser } from "../common/services/discord";
import { fetchBackend } from "../common/helpers";
import { ProjectCard } from './ProjectCard';
import { GetProjectCollaborators, IProject, IProjectCollaborator } from "../common/services/projects";
import styled from "styled-components";

export interface IUserManagerProps {
    project: IProject;
};

interface IUserManagerItem {
    collaborator: IProjectCollaborator;
    discordUser: IDiscordUser;
    avatarUrl: string;
}

interface IRoleGroups {
    [key: string]: IUserManagerItem[];
}

export const UserManager = (props: IUserManagerProps) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");
    const [users, setUsers] = React.useState<IProjectCollaborator[]>([]);

    let [groupedUsers, setGroupedUsers] = React.useState<IRoleGroups>({
        "Developer": [],
        "Translator": [],
        "Beta Tester": [],
        "Other": [],
        "Advocate": [],
        "Lead": [],
        "Support": [],
    });

    React.useEffect(() => {
        getProjectCollaborators(props.project);
    }, []);

    async function removeCollaborator(collaborator: IProjectCollaborator, role: string) {
        const removeCollaboratorReq = await fetchBackend(`projects/collaborators`, "DELETE", {
            userId: collaborator.id,
            role: role,
            projectId: props.project.id,
        });

        if (removeCollaboratorReq.status !== 200) {
            setError("Error while removing collaborator. " + (await removeCollaboratorReq.json()).reason || removeCollaboratorReq.statusText);
            return;
        }

        removeUserFromView(role, collaborator);
    }

    function removeUserFromView(role: string, collaborator: IProjectCollaborator) {
        const newGrouping = { ...groupedUsers };

        var originalSize = newGrouping[role].length;

        newGrouping[role] = newGrouping[role].filter(x => x.collaborator.id != collaborator.id);

        if (newGrouping[role].length == originalSize) {
            setError("Internal error: tried removing a project that doesn't exist.");
            return;
        }

        setGroupedUsers(newGrouping);

        setUsers(users.filter(x => x.id != collaborator.id));
    }

    async function getProjectCollaborators(project: IProject) {
        setLoading(true);

        const collaborators = await GetProjectCollaborators(project.id);
        setUsers(collaborators);

        setLoading(false);

        if (collaborators.length == 0) {
            return;
        }

        const newGrouping = { ...groupedUsers };

        for (const collaborator of collaborators) {
            if (newGrouping[collaborator.role].filter(x => x.collaborator.id == collaborator.id).length > 0)
                continue;

            var discordUser = await GetDiscordUser(collaborator.discordId);
            if (!discordUser)
                return;

            var avatarUrl = await GetUserAvatar(discordUser);
            if (!avatarUrl)
                return;

            newGrouping[collaborator.role].push({ collaborator, discordUser, avatarUrl });
        }

        setGroupedUsers(newGrouping);
    }

    const separatorTheme: ITheme = createTheme({
        fonts: {
            medium: {
                fontSize: '20px',
            },
        },
    });


    return (
        <Stack tokens={{ childrenGap: 20 }} horizontalAlign="center">
            <Stack tokens={{ childrenGap: 5 }}>
                <Stack horizontal tokens={{ childrenGap: 7 }} horizontalAlign="center">
                    <Image style={{ height: 35, width: 35 }} src={props.project.appIcon} />
                    <Stack horizontal tokens={{ childrenGap: 7 }} verticalAlign="baseline">
                        <Text variant="xxLarge">{props.project.appName}</Text>
                        <Text variant="large">collaborators</Text>
                    </Stack>
                </Stack>

                <Text variant="small">{props.project.description}</Text>
            </Stack>

            {(
                (error != "" ?
                    <Stack>
                        <Text>{error}</Text>
                        <PrimaryButton onClick={() => setError("")}>OK</PrimaryButton>
                    </Stack> :

                    loading ?
                        <Spinner label="Loading..." size={SpinnerSize.large} />
                        :

                        (Object.entries(groupedUsers).map(([key, users], i) =>
                        (
                            users.length == 0 ? <div key={"UserManagerSection" + key + i} /> :
                                <Stack tokens={{ childrenGap: 10 }} key={"UserManagerSection" + key + i}>
                                    <Separator theme={separatorTheme}>{key}</Separator>
                                    <Stack horizontal wrap tokens={{ childrenGap: 10 }} style={{ maxWidth: 1000 }}>
                                        {(
                                            users.map((item, i) =>
                                                <Stack horizontalAlign="end" key={"UserManagerItem" + item.collaborator.id + item.collaborator.role}>

                                                    <BaseButton style={{ width: 25, padding: 0, backgroundColor: "transparent", outline: "none", borderColor: "transparent" }} disabled={item.collaborator.isOwner}
                                                        onClick={() => {
                                                            if (window.confirm(`User will lose access to channels or services for this project, and will need to be re-added by a project manager to regain access.\n\nUser will be removed. Are you sure?`)) {
                                                                removeCollaborator(item.collaborator, key);
                                                            }
                                                        }}>
                                                        <Icon iconName="Cancel" style={{ fontSize: 14, padding: 3 }}
                                                            title={item.collaborator.isOwner ? "You cannot remove the owner from this project." : "Remove this user"} ariaLabel="Remove user" />
                                                    </BaseButton>

                                                    <Stack style={{ marginTop: 5, width: 115, }} horizontalAlign="center">
                                                        <Image style={{ height: 75, width: 75, borderRadius: 100 }} src={item.avatarUrl} />
                                                        <Text>{item.collaborator.name}</Text>
                                                        <Text variant="xSmall">a.k.a. {item.discordUser?.username}</Text>
                                                    </Stack>
                                                </Stack>
                                            )
                                        )}
                                    </Stack>
                                </Stack>
                        )

                        ))))}

            {!loading && users.length < 2 ?
                <Stack tokens={{ childrenGap: 20 }}>
                    <Stack tokens={{ childrenGap: 4 }} horizontalAlign="center">
                        <Text variant="large">You aren't collaborating on this project.</Text>
                        <Text>Collab services are available for projects that can actively use it.</Text>
                    </Stack>

                    <Stack tokens={{ childrenGap: 4 }} horizontalAlign="center">
                        <Text variant="small">Includes role management for your testers, translators, developers, patreons, support team and more, with a dedicated channel for your project.</Text>
                        <Text variant="small">Ask a mod to get started!</Text>
                    </Stack>
                </Stack>
                : <></>}
        </Stack>
    )
};