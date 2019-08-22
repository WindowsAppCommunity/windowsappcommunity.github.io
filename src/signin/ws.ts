import { Request } from "express";

function log(log: string) {
    log = "WS /signin: " + log;
}

let connectionsPool: IConnectionState[] = [];

module.exports = function (expressWs: any, endpoint: string) {
    return (ws: any, req: Request) => {

        ws.on('message', function (data: string) {
            let msg: IConnectionState = JSON.parse(data);
            if (instanceOfIConnectionState(msg)) {
                let existingConState = getStoredConnectionById(msg.connectionId);

                switch (msg.status) {
                    case "start":
                        log("Started session with ID " + msg.connectionId);
                        msg.ws = [ws];
                        connectionsPool.push(msg);
                        break;
                    case "done":
                        log("Done signal for session ID " + msg.connectionId);
                        addParticipatingWs(msg.connectionId, ws);

                        if (existingConState) {
                            closeAll(msg);
                        } else log("Done signal recieved for a nonexistent connection");
                        break;
                }
            }
        });
    };
};

function addParticipatingWs(connectionId: number, ws: any) {
    for (let item of connectionsPool) {
        if (item.connectionId == connectionId) { // Need the correct ID to get added to the pool
            if (item.ws) item.ws.push();
        }
    }
}

function getStoredConnectionById(id: number): IConnectionState | undefined {
    let connectionMatches: IConnectionState[] = connectionsPool.filter(state => state.connectionId == id);
    if (connectionMatches[0]) return connectionMatches[0];
}

function closeAll(conState: IConnectionState) {
    broadcast(conState, true);

    setTimeout(() => {
        for (let i = 0; i < connectionsPool.length; i++) {
            if (connectionsPool[i].connectionId == conState.connectionId) {
                connectionsPool.splice(i, 1);
            }
        }
    }, 5000);
}

function broadcast(conState: IConnectionState, terminateOnDone?: boolean) {
    log("Broadcasting: " + JSON.stringify(conState));

    conState.ws = undefined;

    for (let con of connectionsPool) {
        if (con.connectionId == conState.connectionId && con.ws) {
            for (let ws of con.ws) {
                ws.send(JSON.stringify(conState));
                if (terminateOnDone) ws.terminate();
            }
        }
    }
}

interface IConnectionState {
    connectionId: number;
    status: "start" | "done";
    ws?: any[];
    discordAuthResponse?: IDiscordAuthResponse;
}

interface IDiscordAuthResponse {
    "access_token": string;
    "token_type": "Bearer"
    "expires_in": number,
    "refresh_token": string,
    "scope": string;
  }


function instanceOfIConnectionState(object: any): object is IConnectionState {
    return object.connectionId != undefined;
}
