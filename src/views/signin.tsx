import { Text, Stack, Label, Spinner } from "office-ui-fabric-react";
import React, { useState, useEffect } from "react";
import { IDiscordAuthResponse } from "../common/interfaces";
import { AuthData } from "../common/discordService";

let Authenticated: boolean = false;

const WebSocketContainer: React.FC<any> = (props: any) => {
    // A container to help manage the web socket so it doesn't reload every time data from the socket updates data on the page
    let connection = new WebSocket("wss://uwpcommunity-site-backend.herokuapp.com/signin/");

    const [connectionState, setConnectionState] = useState<IConnectionState>({
        connectionId: (Math.floor(Math.random() * 10000000) + 1),
        status: Authenticated ? "done" : "start"
    });

    const [WebSocketReady, SetWebSocketReady] = useState<boolean>(false);

    connection.onopen = WebSocket_OnOpen;
    connection.onmessage = WebSocket_OnMessage;

    function WebSocket_OnOpen(this: WebSocket, ev: Event) {
        console.info("Handshake established with login verification server");
        if (Authenticated) {
            console.info("Already authenticated");
            return;
        }
        connection.send(JSON.stringify(connectionState));
        SetWebSocketReady(true);
    }

    function WebSocket_OnMessage(this: WebSocket, ev: MessageEvent) {
        console.info("Socket message: ", ev.data);
        let message: IConnectionState = JSON.parse(ev.data);

        if (message.status === "done" && message.discordAuthResponse) {
            AuthData.Set(message.discordAuthResponse);
            setConnectionState(message);
            Authenticated = true;
        }
    }

    return (
        <div>
            <SignInStatus ConnectionState={connectionState} ready={WebSocketReady} />
        </div>
    )
};

export const Signin = () => {
    return (
        <Stack>
            <WebSocketContainer />
        </Stack>
    )
};

let windowOpened: boolean = false;

interface ISignInStatus {
    ConnectionState: IConnectionState,
    ready: boolean;
};

export const SignInStatus = (props: ISignInStatus) => {
    let discordAuthEndpoint = `https://discordapp.com/api/oauth2/authorize?client_id=611491369470525463&redirect_uri=http%3A%2F%2Fuwpcommunity-site-backend.herokuapp.com%2Fsignin%2Fredirect&response_type=code&scope=guilds%20identify&state=${props.ConnectionState.connectionId}`;

    const [showRedirectLink, setShowRedirectLink] = useState<boolean>(false);

    if (props.ConnectionState.status === "start" && !windowOpened && props.ready) {
        window.open(discordAuthEndpoint);
        windowOpened = true;
    }

    if (props.ConnectionState.discordAuthResponse !== undefined) {
        window.location.href = "/";
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowRedirectLink(true);
        }, 7000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Stack>
            {
                props.ConnectionState.status === "start" ? (
                    <Stack horizontalAlign="center">
                        <Label>Taking you to Discord</Label>
                        <Spinner label="Hold on tight" ariaLive="assertive" />
                        <Text style={{ visibility: showRedirectLink ? "visible" : "hidden" }}>If not redirected automatically, <a href={discordAuthEndpoint} target="_blank" rel="noopener noreferrer">click here</a></Text>
                    </Stack>
                )
                    :
                    props.ConnectionState.discordAuthResponse !== undefined ? // Make sure the token is present
                        <Stack>
                            <Text variant="xLarge">Authenticated successfully</Text>
                            <Text variant="medium">Redirecting...</Text>
                        </Stack> :
                        <Text>Authentication failed: {JSON.stringify(props.ConnectionState)}</Text>
            }
        </Stack>
    )
};

interface IConnectionState {
    connectionId: number;
    status: string;
    discordAuthResponse?: IDiscordAuthResponse;
}

/**
 * Todo: Post-sign in
 *
 * Redirect to a /me/ page to manage apps
 * Use discord.js to verify the user is in the server
 * Ask the user to join if not (provide link)
 * Display their name and icon on the page
 */