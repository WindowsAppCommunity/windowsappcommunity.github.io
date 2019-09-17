import { Text, Stack, Label, Spinner } from "office-ui-fabric-react";
import React, { useState, useEffect } from "react";
import { AuthData } from "../common/discordService";

export const Signin: React.FC<any> = () => {

    let authResponse: string | null = (new URL(window.location.href)).searchParams.get("authResponse");

    if (authResponse) {
        authResponse = atob(authResponse);
        AuthData.Set(JSON.parse(authResponse));

        window.location.href = "/dashboard";
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
                    <Label>Signing in...</Label>
                    <Spinner label="Hold on tight" ariaLive="assertive" />
                    <Text style={{ visibility: showRedirectLink ? "visible" : "hidden" }}>If not redirected automatically, <a href="/dashboard">click here</a></Text>
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