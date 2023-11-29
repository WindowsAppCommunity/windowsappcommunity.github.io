import { Text, Stack, Label, Spinner } from "@fluentui/react";
import React, { useState, useEffect } from "react";
import { AuthData } from "../common/services/discord";

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
