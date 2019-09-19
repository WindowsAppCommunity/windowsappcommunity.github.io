import { Text, Stack, Persona, PersonaSize, Icon, Link, Dialog, DialogType } from "office-ui-fabric-react";
import React from "react";
import { GetUserAvatar, GetCurrentUser, IDiscordUser, discordAuthEndpoint, getGuildMember } from "../common/services/discord";

import styled from "styled-components";
import { RegisterAppForm } from "../components/forms/RegisterApp";
import { RegisterDevForm } from "../components/forms/RegisterDev";

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

    const [roles, setRoles] = React.useState<string[]>();

    const [appRegistrationShown, setAppRegistrationShown] = React.useState(false);
    const [devRegistrationShown, setDevRegistrationShown] = React.useState(false);

    React.useEffect(() => {
        setupLoggedInUser();
    }, []);

    async function setupLoggedInUser() {
        let user: IDiscordUser | undefined = await GetCurrentUser();
        if (!user) {
            window.location.href = discordAuthEndpoint;
            return;
        };
        setWelcomeMessage(user.username);
        setUserIcon(await GetUserAvatar(user) || "");

        const guildMember = await getGuildMember(user);
        if (!guildMember) return;

        setRoles(guildMember.roles);
    }

    const PersonaDark = styled(Persona)`
    * {
        :hover {
            color: white;
        }
        color: #f7f7f7;
        font-size: 22px;
    }
    `;

    const SectionTitleIconFontSize = 34;

    const DashboardColumnFiller = styled.div`
    @media only screen and (max-width: 807px) {
        display: none;
    } 
    `;

    return (
        <Stack tokens={{ childrenGap: 25 }}>
            <DashboardHeader>
                <Stack horizontal wrap style={{ padding: "15px 0px", margin: 0 }} verticalAlign="center" horizontalAlign="space-around" tokens={{ childrenGap: 25 }}>
                    <PersonaDark size={PersonaSize.extraLarge} text={welcomeMessage} imageUrl={userIcon} />

                    <Stack horizontal wrap verticalAlign="end" tokens={{ childrenGap: 10 }} style={{ marginLeft: 10 }}>

                        {/*                         {!roles ? "" : roles.includes(developerRoleId.toString()) ?
 */}                            <Link style={{ color: "white", width: "150px", textDecoration: "none" }} onClick={() => setAppRegistrationShown(true)}>
                            <Stack verticalAlign="end" horizontalAlign="center" tokens={{ childrenGap: 5 }}>
                                <Icon style={{ fontSize: 35 }} iconName="AppIconDefaultAdd"></Icon>
                                <Text variant="mediumPlus">Register an app</Text>
                            </Stack>
                        </Link>
                        {/*                             :
 */}                            <Link style={{ color: "white", width: "150px", textDecoration: "none" }} onClick={() => setDevRegistrationShown(true)}>
                            <Stack verticalAlign="end" horizontalAlign="center" tokens={{ childrenGap: 5 }}>
                                <Icon style={{ fontSize: 35 }} iconName="code"></Icon>
                                <Text variant="mediumPlus">Become a Developer</Text>
                            </Stack>
                        </Link>
                        {/*                         }
 */}                        <Link style={{ color: "white", width: "150px", textDecoration: "none" }} to="/dashboard/registerapp">
                            <Stack verticalAlign="end" horizontalAlign="center" tokens={{ childrenGap: 5 }}>
                                <Icon style={{ fontSize: 35 }} iconName="Robot"></Icon>
                                <Text variant="mediumPlus">Manage your roles</Text>
                            </Stack>
                        </Link>

                    </Stack>

                    <DashboardColumnFiller style={{ width: 200 }} />
                </Stack>
            </DashboardHeader>

            <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
                    <Icon style={{ fontSize: "24px" }} iconName="BuildDefinition" />
                    <Text variant="xLarge">Under construction</Text>
                </Stack>

                <Text variant="large">This area is still being worked on. Check back later</Text>
            </Stack>

            <Stack horizontalAlign="center" wrap horizontal tokens={{ childrenGap: 20 }}>

                {/* Todo: Hide this area if the user doesn't have Dev role, or no apps are registered */}
                <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
                    <Stack horizontal tokens={{ childrenGap: 15 }}>
                        <Icon iconName="AppIconDefaultList" style={{ fontSize: SectionTitleIconFontSize }} />
                        <Text variant="xLarge" style={{ fontWeight: 600 }}>My apps</Text>
                    </Stack>

                    <Text variant="large">You don't have any registered apps</Text>
                </Stack>

                <Dialog isOpen={appRegistrationShown} dialogContentProps={{
                    type: DialogType.largeHeader,
                    title: 'Register an app',
                }}>
                    <RegisterAppForm onCancel={() => setAppRegistrationShown(false)} />
                </Dialog>

                <Dialog isOpen={devRegistrationShown} dialogContentProps={{ type: DialogType.largeHeader, title: "Become a developer", subText: "You will be given the Developer role in the UWP Community Discord server, and become eligible for services exclusive to devs" }}>
                    <RegisterDevForm onCancel={() => setDevRegistrationShown(false)} />
                </Dialog>
            </Stack>

        </Stack >
    )
};