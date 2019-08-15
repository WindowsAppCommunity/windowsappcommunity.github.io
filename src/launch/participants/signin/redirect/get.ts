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
    var client = new WebSocketClient();

    client.on('connect', function (connection: any) {
        console.log('WebSocket Client Connected');
        connection.on('error', function (error: any) {
            console.log("Connection Error: " + error.toString());
        });

        let NewState: IConnectionState = {
            connectionId: state,
            status: "done"
        };
        connection.send(JSON.stringify(NewState));
        connection.close();
    });
    client.connect('ws://uwpcommunity-site-backend.herokuapp.com/launch/participants/signin/');
};


interface IConnectionState {
    connectionId: number;
    status: "start" | "inprogress" | "done";
}