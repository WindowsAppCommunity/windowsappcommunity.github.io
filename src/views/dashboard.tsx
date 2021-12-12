import { Text, Stack, Persona, PersonaSize, Icon, Link, Dialog, DialogType, DefaultButton, PrimaryButton, FontIcon, PivotItem, Pivot, Modal } from "office-ui-fabric-react";
import React from "react";
import { GetUserAvatar, GetCurrentDiscordUser, IDiscordUser, discordAuthEndpoint, GetUserRoles, AssignUserRole } from "../common/services/discord";

import styled from "styled-components";
import { CreateProjectForm } from "../components/forms/CreateProjectForm";
import { IProject, IProjectCollaborator } from "../common/services/projects";
import { ProjectCard } from "../components/ProjectCard";
import { RoleManager } from "../components/RoleManager";
import { GetUserProjects, IUser } from "../common/services/users";
import { ProjectReviewPanel, ReviewType } from "../components/ProjectReviewPanel";
import { fetchBackend } from "../common/helpers";

const DashboardHeader = styled.header`
background: linear-gradient(to bottom,#005799 0,#0076d1);
box-shadow: 0 12px 45px -8px rgba(0,120,215,.35);
width: 100vw;
margin: 0px;
padding: 15px 0px;
`;

export const Dashboard = () => {
    const [welcomeMessage, setWelcomeMessage] = React.useState("Signing in...");
    const [userIcon, setUserIcon] = React.useState("");
    const [user, setUser] = React.useState<IDiscordUser>();

    const [roles, setRoles] = React.useState<string[]>([]);

    const [appRegistrationShown, setAppRegistrationShown] = React.useState(false);
    const [devRegistrationShown, setDevRegistrationShown] = React.useState(false);

    React.useEffect(() => {
        setupLoggedInUser();
    });

    async function setupLoggedInUser() {
        let user: IDiscordUser | undefined = await GetCurrentDiscordUser();
        if (navigator.userAgent.includes("ReactSnap")) return;
        if (!user) {
            window.location.href = discordAuthEndpoint;
            return;
        }

        setUser(user);

        if (welcomeMessage === "Signing in...") setWelcomeMessage(`Welcome, ${user.username}`);
        if (!userIcon) setUserIcon(await GetUserAvatar(user) || "");

        const userRoles = await GetUserRoles(user);
        if (userRoles && roles.length === 0) setRoles(userRoles);
    }

    async function onDevRegisterFormSuccess() {
        setDevRegistrationShown(false);

        AssignUserRole("Developer");
        setTimeout(() => {
            setupLoggedInUser();
        }, 1000);
    }

    async function onAppRegisterFormSuccess() {
        setAppRegistrationShown(false);
    }

    const PersonaDark = styled(Persona)`
    * {
        &:hover {
            color: white;
        }
        color: #f7f7f7;
        font-size: 22px;
    }
    `;

    const SectionTitleIconFontSize = 22;

    const DashboardColumnFiller = styled.div`
    @media only screen and (max-width: 807px) {
        display: none;
    } 
    `;

    return (
        <Stack tokens={{ childrenGap: 25 }}>
            <DashboardHeader>
                <Stack horizontal wrap style={{ padding: "10px 0px", margin: 0 }} verticalAlign="center" horizontalAlign="space-evenly" tokens={{ childrenGap: 25 }}>
                    <PersonaDark size={PersonaSize.size72} styles={{ primaryText: { color: "white" } }} text={welcomeMessage} imageUrl={userIcon} />

                    <Stack horizontal wrap verticalAlign="end" tokens={{ childrenGap: 10 }} style={{ marginLeft: 10 }}>
                        {roles.includes("Developer") ?
                            <Link style={{ color: "white", width: "150px", textDecoration: "none" }} onClick={() => setAppRegistrationShown(true)}>
                                <Stack verticalAlign="end" horizontalAlign="center" tokens={{ childrenGap: 5 }}>
                                    <Icon style={{ fontSize: 35, userSelect: "none" }} iconName="AppIconDefaultAdd"></Icon>
                                    <Text variant="mediumPlus">Register an app</Text>
                                </Stack>
                            </Link>
                            :
                            <Link style={{ color: "white", width: "170px", textDecoration: "none" }} onClick={() => setDevRegistrationShown(true)}>
                                <Stack verticalAlign="end" horizontalAlign="center" tokens={{ childrenGap: 5 }}>
                                    <Icon style={{ fontSize: 35, userSelect: "none" }} iconName="code"></Icon>
                                    <Text variant="mediumPlus">Become a Developer</Text>
                                </Stack>
                            </Link>
                        }

                    </Stack>
                </Stack>
            </DashboardHeader>


            <Stack horizontalAlign="center" wrap horizontal tokens={{ childrenGap: 20 }}>

                <Stack style={{ margin: 50 }} horizontalAlign="center" tokens={{ childrenGap: 20 }}>
                    <Stack horizontalAlign="center">
                        <Stack horizontal tokens={{ childrenGap: 15 }}>
                            <Icon iconName="AppIconDefaultList" style={{ fontSize: SectionTitleIconFontSize }} />
                            <Text variant="xLarge" style={{ fontWeight: 600 }}>Your Projects</Text>
                        </Stack>

                        <Text>All projects you own or collaborate on</Text>
                    </Stack>

                    {(
                        user?.id !== undefined ?
                            <RoleManager discordId={user.id} />
                            : <></>
                    )}
                </Stack>

                <Dialog hidden={!appRegistrationShown}
                    dialogContentProps={{
                        type: DialogType.close,
                        title: 'Register an app',
                        styles: { title: { color: "rgb(0, 120, 212)", borderBottom: "2px solid rgb(0, 117, 209)", maxWidth: 240, margin: "0px 0px 15px 23px", paddingBottom: 11, paddingLeft: 10 } },
                        onDismiss: () => setAppRegistrationShown(false)
                    }}>
                    <CreateProjectForm projectData={{}} onSuccess={onAppRegisterFormSuccess} onCancel={() => setAppRegistrationShown(false)} />
                </Dialog>

                <Dialog hidden={!devRegistrationShown} dialogContentProps={{
                    type: DialogType.largeHeader, title: "Become a developer"
                }}>
                    <Stack tokens={{ childrenGap: 10 }} horizontalAlign="center">
                        <FontIcon iconName="GiftboxOpen" style={{ fontSize: 56 }} />
                        <Text variant="xLarge">Let's build something together</Text>
                        <Text variant="medium">Everyone is invited, from novices to seasoned veterans.</Text>
                        <Text variant="medium">You'll be given the developer role and get access to collaboration services for your projects.</Text>
                        <Stack horizontal horizontalAlign="space-evenly" tokens={{ childrenGap: 10 }}>
                            <DefaultButton onClick={() => setDevRegistrationShown(false)}>Cancel</DefaultButton>
                            <PrimaryButton onClick={onDevRegisterFormSuccess}>Register</PrimaryButton>
                        </Stack>
                    </Stack>
                </Dialog>
            </Stack>

            {
                roles.includes("Mod") || roles.includes("Admin") || roles.includes("Launch Coordinator") ?
                    <Stack horizontalAlign="center">
                        <Pivot styles={{ root: { justifyContent: "center", display: "flex" }, itemContainer: { padding: 20 } }}>
                            {
                                roles.includes("Mod") || roles.includes("Admin") ?
                                    <PivotItem headerText="Needs manual review">
                                        <ProjectReviewPanel type={ReviewType.ManualReview} />
                                    </PivotItem> : <></>
                            }
                            {
                                roles.includes("Launch Coordinator") ?
                                    <PivotItem headerText="Launch submissions">
                                        <ProjectReviewPanel type={ReviewType.Launch} />
                                    </PivotItem> : <></>
                            }
                        </Pivot>
                    </Stack>
                    : <></>
            }
        </Stack>
    )
};