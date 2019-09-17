import { Text, Stack, Checkbox, PrimaryButton, Toggle, Pivot, PivotItem, Persona, PersonaSize, DefaultButton, Icon, IPersonaProps, IRenderFunction } from "office-ui-fabric-react";
import React from "react";
import { GetUserAvatar, GetCurrentUser, IDiscordUser, AuthData, IsUserInServer, discordAuthEndpoint } from "../common/services/discord";

import HoverBox from "../components/HoverBox";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const DashboardHeader = styled.header`
background: linear-gradient(to bottom,#005799 0,#0076d1);
box-shadow: 0 12px 45px -8px rgba(0,120,215,.35);
width: 100vw;
padding: 10px;
`;

export const Dashboard = () => {
    const [welcomeMessage, setWelcomeMessage] = React.useState("Signing in...");
    const [userIcon, setUserIcon] = React.useState("");

    React.useEffect(() => {
        setupLoggedInUser();
    }, []);

    async function setupLoggedInUser() {
        let user: IDiscordUser | undefined = await GetCurrentUser();
        if (!user) {
            window.location.href = discordAuthEndpoint;
            return;
        };
        setWelcomeMessage(`Welcome, ${user.username}`);
        setUserIcon(await GetUserAvatar(user) || "");
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

    return (
        <Stack horizontalAlign="center" tokens={{ childrenGap: 15 }}>
            <DashboardHeader>
                <Stack style={{ padding: "10px" }} tokens={{ childrenGap: 20 }}>
                    <PersonaDark size={PersonaSize.extraLarge} text={welcomeMessage} imageUrl={userIcon} />

                    <Stack horizontal wrap tokens={{ childrenGap: 10 }} style={{ marginLeft: 10 }}>
                        <NavLink style={{ color: "white", width: "135px", textDecoration: "none" }} to="/dashboard/registerapp">
                            <Stack verticalAlign="center" horizontal tokens={{ childrenGap: 5 }}>
                                <Icon iconName="AppIconDefaultAdd"></Icon>
                                <Text variant="mediumPlus">Register an app</Text>
                            </Stack>
                        </NavLink>
                    </Stack>

                </Stack>
            </DashboardHeader>

            {/* Todo, move most of these options out of here and into the user menu dropdown */}
            <Stack horizontal wrap horizontalAlign="center" tokens={{ childrenGap: 25 }}>
                <Stack horizontalAlign="center" tokens={{ childrenGap: 5 }}>

                    <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
                        <Icon style={{ fontSize: "24px" }} iconName="BuildDefinition" />
                        <Text variant="xLarge">Under construction</Text>
                    </Stack>


                    <Text variant="large">This area is still being worked on. Check back later</Text>


                </Stack>

            </Stack>
        </Stack>
    )
};