import { Text, Stack, Button } from "office-ui-fabric-react";
import React, { useState, CSSProperties } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Signup = () => {
    const [signedIn, setSignedIn] = useState(false);

    return (
        <Text>Signup</Text>
    )
};

const FaIconStyle: CSSProperties = {
    color: "white",
    height: "20px",
    width: "20px",
    paddingLeft: "10px"
};
const SignInButton = () => {
    return (
        <Button primary style={{ padding: "20px" }}>
            <Text>Sign in with Discord</Text>
            <FontAwesomeIcon style={FaIconStyle} icon={["fab", "discord"]} />
        </Button>
    )
};