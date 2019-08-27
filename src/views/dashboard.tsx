import { Text, Stack, Checkbox, PrimaryButton } from "office-ui-fabric-react";
import React from "react";
import { GetUserAvatar, GetCurrentUser, IDiscordUser, AuthData, IsUserInServer } from "../common/discordService";

import HoverBox from "../components/HoverBox";

export const Dashboard = () => {
    const [welcomeMessage, setWelcomeMessage] = React.useState("Signing in...");

    React.useEffect(() => {
        setupLoggedInUser();
    }, []);

    async function setupLoggedInUser() {
        let user: IDiscordUser | undefined = await GetCurrentUser();
        if(!user) return;
        setWelcomeMessage(`Welcome, ${user.username}`);
    }

    return (
        <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
            <p style={{ fontFamily: "Segoe UI, Sans-Serif", fontWeight: "lighter", fontSize: "24px", margin: 0 }}>{welcomeMessage}</p>

            <Stack horizontal wrap horizontalAlign="center" tokens={{ childrenGap: 25 }}>
                <HoverBox style={{ padding: "20px" }}>
                    <Stack horizontalAlign="center" tokens={{ childrenGap: 5 }}>
                        <Text variant="xLarge">🐱‍🏍 Launch 2020</Text>
                        <Text variant="large">You aren't registered for the Launch event</Text>

                        <PrimaryButton href="/launch/register" style={{ marginTop: "20px" }} primary text="Register for Launch 2020" />
                    </Stack>
                </HoverBox>

                <HoverBox style={{ height: "300px", width: "250px", padding: "15px" }} hidden>
                    <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
                        <Text variant="xLarge">User settings</Text>
                        <Stack horizontal verticalFill wrap tokens={{ childrenGap: 10 }}>
                            <Checkbox label="I'm a developer" />
                        </Stack>
                    </Stack>
                </HoverBox>
            </Stack>
        </Stack>
    )
};