import { Request, Response } from "express";
var WebSocketClient = require('websocket').client;
const request = require("request");

function log(log: string) {
    log = "GET /signin/redirect: " + log;
}

module.exports = (req: Request, res: Response) => {
    if (!req.query.state) {
        res.status(422);
        res.json(JSON.stringify({
            error: "Malformed request",
            reason: "Missing state"
        }));
        return;
    }

    let state = req.query.state;
    let code = req.query.code;

    var client = new WebSocketClient();

    client.on('connect', function (connection: any) {
        console.log('WebSocket Client Connected');
        connection.on('error', function (error: any) {
            console.log("Connection Error: " + error.toString());
        });
        console.log("Token: " + code);
        request.post({
            url: 'https://discordapp.com/api/oauth2/token',
            form: {
                client_id: process.env.discord_client,
                client_secret: process.env.discord_secret,
                grant_type: "authorization_code",
                code: code,
                redirect_uri: "http://uwpcommunity-site-backend.herokuapp.com/signin/redirect",
                scope: "identify guilds"
            }
        }, (err: Error, httpResponse: any, body: string) => {
            let NewState: IConnectionState = {
                connectionId: state,
                status: "done",
                discordAuthResponse: JSON.parse(body)
            };
            connection.send(JSON.stringify(NewState));
            setTimeout(() => {
                res.send(`<script> window.close(); </script>`);
                connection.close();
            }, 1000);
        });

    });
    client.connect('wss://uwpcommunity-site-backend.herokuapp.com/signin/', null, null, null, null);
};


interface IDiscordAuthResponse {
    "access_token": string;
    "token_type": "Bearer"
    "expires_in": number,
    "refresh_token": string,
    "scope": string;
  }

interface IConnectionState {
    connectionId: number;
    status: "start" | "done";
    discordAuthResponse?: IDiscordAuthResponse;
}