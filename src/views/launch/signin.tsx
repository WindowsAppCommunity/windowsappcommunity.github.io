import { Text, Stack, Label, Spinner } from "office-ui-fabric-react";
import React, { useState, useEffect } from "react";

const WebSocketContainer: React.FC<any> = (props: any) => {
    let connection = new WebSocket("wss://uwpcommunity-site-backend.herokuapp.com/launch/participants/signin/");

    const [connectionId, setConnectionId] = useState<number>(Math.floor(Math.random() * 10000000) + 1);
    const [status, setStatus] = useState<"start" | "inprogress" | "done">("start");
    const [WebSocketReady, SetWebSocketReady] = useState<boolean>(false);

    connection.onopen = WebSocket_OnOpen;
    connection.onmessage = WebSocket_OnMessage;

    function WebSocket_OnOpen(this: WebSocket, ev: Event) {
        console.info("Handshake established with login verification server");
        let connectionState: IConnectionState = {
            connectionId, status
        }
        connection.send(JSON.stringify(connectionState));
        SetWebSocketReady(true);
    }

    function WebSocket_OnMessage(this: WebSocket, ev: MessageEvent) {
        let message = ev.data;
        console.info("Socket message: ", message);

        if (message) {
            setStatus(message);
        }
    }

    return (
        <div>
            <SignInStatus ConnectionState={{
                connectionId, status
            }} ready={WebSocketReady} />
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
    let discordAuthEndpoint = `https://discordapp.com/api/oauth2/authorize?client_id=611491369470525463&redirect_uri=http%3A%2F%2Fuwpcommunity-site-backend.herokuapp.com%2Flaunch%2Fparticipants%2Fsignin%2Fredirect&response_type=code&scope=guilds%20identify&state=${props.ConnectionState.connectionId}`;

    const [showRedirectLink, setShowRedirectLink] = useState<boolean>(false);

    if (props.ConnectionState.status == "start" && !windowOpened && props.ready) {
        window.open(discordAuthEndpoint);
        windowOpened = true;
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
                props.ConnectionState.status == "start" ? (
                    <Stack horizontalAlign="center">
                        <Label>Taking you to Discord</Label>
                        <Spinner label="Hold on tight" ariaLive="assertive" />
                        <Text style={{ visibility: showRedirectLink ? "visible" : "hidden" }}>If not redirected automatically, <a href={discordAuthEndpoint} target="_blank">click here</a></Text>
                    </Stack>
                )
                    : props.ConnectionState.status == "inprogress" ? <Text>In Progress</Text>
                        : <Stack>
                            <Text variant="xLarge">Authenticated successfully</Text>
                            <Text variant="mediumPlus">This page is still under development</Text>
                        </Stack>
            }
        </Stack>
    )
};

interface IConnectionState {
    connectionId: number;
    status: string;
    discordToken?: string;
}


/**
 * Todo: Post-sign in
 *
 * Redirect to a /me/ page to manage apps
 * Use discord.js to verify the user is in the server
 * Ask the user to join if not (provide link)
 * Display their name and icon on the page
 */