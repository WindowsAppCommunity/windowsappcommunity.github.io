import React, { useState } from "react";
import { Text, Stack } from "office-ui-fabric-react";

export const Launch = () => {
    const [signedIn, setSignedIn] = useState(false);

    return (
        (signedIn ? <p>Signed in</p> : SignIn)
    );
};

const SignIn = () => {
    return (
        <Stack horizontal horizontalAlign="center">
            <Text variant="large" style={{ padding: 10 }}>
                Sign in with Discord
            </Text>
        </Stack>
    )
};