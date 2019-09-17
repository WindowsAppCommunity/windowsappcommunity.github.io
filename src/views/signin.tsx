import { Text, Stack, Label, Spinner } from "office-ui-fabric-react";
import React, { useState, useEffect } from "react";
import { AuthData } from "../common/discordService";
import { isLocalhost } from "../common/const";

export const Signin: React.FC<any> = (props: any) => {
    let discordAuthEndpoint = (
        isLocalhost ?
            `https://discordapp.com/api/oauth2/authorize?client_id=611491369470525463&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fsignin%2Fredirect&response_type=code&scope=identify%20guilds`
            :
            `https://discordapp.com/api/oauth2/authorize?client_id=611491369470525463&redirect_uri=http%3A%2F%2Fuwpcommunity-site-backend.herokuapp.com%2Fsignin%2Fredirect&response_type=code&scope=identify%20guilds&state=${props.ConnectionState.connectionId}`
    );

    let authResponse: string | null = (new URL(window.location.href)).searchParams.get("authResponse");
    console.log(authResponse);

    if (navigator.userAgent != "ReactSnap") {
        if (!authResponse) {
            window.location.href = discordAuthEndpoint;
        } else {
            authResponse = atob(authResponse);
            AuthData.Set(JSON.parse(authResponse));

            window.location.href = "/dashboard";
        }
    }

    const [showRedirectLink, setShowRedirectLink] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowRedirectLink(true);
        }, 7000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            <Stack>
                <Stack horizontalAlign="center">
                    <Label>Taking you to Discord</Label>
                    <Spinner label="Hold on tight" ariaLive="assertive" />
                    <Text style={{ visibility: showRedirectLink ? "visible" : "hidden" }}>If not redirected automatically, <a href={discordAuthEndpoint}>click here</a></Text>
                </Stack>
            </Stack>
        </div>
    )
};

/**
 * Todo: Post-sign in
 *
 * Redirect to a /me/ page to manage apps
 * Use discord.js to verify the user is in the server
 * Ask the user to join if not (provide link)
 * Display their name and icon on the page
 */