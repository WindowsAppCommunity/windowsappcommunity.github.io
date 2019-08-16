import { Text, Stack, Label, Spinner } from "office-ui-fabric-react";
import React, { useState, useEffect } from "react";

let connection = new WebSocket("ws://uwpcommunity-site-backend.herokuapp.com/launch/participants/signin/");

const WebSocketContainer: React.FC<any> = (props: any) => {
    const [connectionId, setConnectionId] = useState<number>(Math.floor(Math.random() * 10000000) + 1);
    const [status, setStatus] = useState<"start" | "inprogress" | "done">("start");

    function WebSocket_Init() {
        connection.onopen = WebSocket_OnOpen;
        connection.onmessage = WebSocket_OnMessage;
    }

    function WebSocket_OnOpen(this: WebSocket, ev: Event) {
        console.info("Handshake established with login verification server");
        let connectionState: IConnectionState = {
            connectionId, status
        }
        connection.send(JSON.stringify(connectionState));
    }

    function WebSocket_OnMessage(this: WebSocket, ev: MessageEvent) {
        let message = ev.data;
        console.info("Socket message: ", message);

        if (message) {
            setStatus(message);
        }
    }

    WebSocket_Init();

    return (
        <div>
            <SignInStatus connectionId={connectionId} status={status} />
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

let windowOpened : boolean = false;

export const SignInStatus = (props: IConnectionState) => {
    let discordAuthEndpoint = `https://discordapp.com/api/oauth2/authorize?client_id=611491369470525463&redirect_uri=http%3A%2F%2Fuwpcommunity-site-backend.herokuapp.com%2Flaunch%2Fparticipants%2Fsignin%2Fredirect&response_type=code&scope=guilds%20identify&state=${props.connectionId}`;

    const [showRedirectLink, setShowRedirectLink] = useState<boolean>(false);

    if (props.status == "start" && !windowOpened) {
        window.open(discordAuthEndpoint);
        windowOpened = true;
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowRedirectLink(true);
        }, 7000);
        return () => clearTimeout(timer);
    }, [])

    return (
        <Stack>
            {
                props.status == "start" ? (
                    <Stack horizontalAlign="center">
                        <Label>Taking you to Discord</Label>
                        <Spinner label="Hold on tight" ariaLive="assertive" />
                        <Text style={{ visibility: showRedirectLink ? "visible" : "hidden" }}>If not redirected automatically, <a href={discordAuthEndpoint} target="_blank">click here</a></Text>
                    </Stack>
                )
                    : props.status == "inprogress" ? <Text>In Progress</Text>
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