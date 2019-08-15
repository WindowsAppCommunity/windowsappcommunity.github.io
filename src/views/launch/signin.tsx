import { Text, Stack, Button, BaseButton } from "office-ui-fabric-react";
import React, { useState, CSSProperties } from "react";

export const Signin = () => {
    const [connectionState, setConnectionState] = useState<IConnectionState>({
        id: Math.floor(Math.random() * 10000000) + 1,
        status: "start"
    });

    let connection: WebSocket;

    function WebSocket_Init() {
        connection = new WebSocket("ws://localhost:5000/launch/participants/signin/");
        connection.onmessage = WebSocket_OnMessage;
    }

    function WebSocket_OnMessage(this: WebSocket, ev: MessageEvent) {
        let message = ev.data as IConnectionState;
        console.log(message);

        if (message.status) {
            setConnectionState(message);
        }
    }

    WebSocket_Init();
    return (
        <Stack>
            {JSON.stringify(connectionState)}
        </Stack>
    )
};

interface IConnectionState {
    id: Number;
    status: "start" | "inprogress" | "done";
    participatingAddresses?: string[];
}


function SignIntoDiscord_Clicked() {
    /**
     * TODO: Basic sign in 
     * https://discordapp.com/developers/docs/topics/oauth2
     * https://discordapp.com/api/oauth2/authorize?client_id=611491369470525463&redirect_uri=https%3A%2F%2Fuwpcommunity-site-backend.herokuapp.com%2Flaunch%2Fparticipants%2Fsignin&response_type=code&scope=guilds%20identify
     * 
     * Generate unique id
     * Establish WebSocket to backend with id
     * Open discord auth endpoint in new tab, pass id as state param
     * Wait for user to authenticate
     * Set up discord auth redirect URI on backend to ping "ok" back to the page via the websocket, using state to ping the right socket
     * Attempt to auto close the redirect auth page
     * Use localstorage to keep the user logged in 
     */
}




/**
 * Todo: Post-sign in
 *
 * Redirect to a /me/ page to manage apps
 * Use discord.js to verify the user is in the server
 * Ask the user to join if not (provide link)
 * Display their name and icon on the page
 */