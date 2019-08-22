import { Request, Response } from "express";
var WebSocketClient = require('websocket').client;

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

        let NewState: IConnectionState = {
            connectionId: state,
            status: "done",
            code: code
        };
        connection.send(JSON.stringify(NewState));

        setTimeout(() => {
            //res.send(`<script> window.close(); </script>`);
            connection.close();
        }, 2000);
    });
    client.connect('wss://uwpcommunity-site-backend.herokuapp.com/launch/participants/signin/', null, null, null, null);
};


interface IConnectionState {
    connectionId: number;
    status: "start" | "inprogress" | "done";
    code?: string;
}