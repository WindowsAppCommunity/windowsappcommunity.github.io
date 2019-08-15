import { Request } from "express";
import { connect } from "tls";

let connectionsPool: IConnectionState[] = [];

module.exports = function (expressWs: any, endpoint: string) {
    return (ws: any, req: Request) => {
        console.log("Websocket established");

        ws.on('close', function close() {
            console.log('disconnected');
        });

        ws.on('message', function (data: string) {
            let msg: IConnectionState = JSON.parse(data);
            console.log("Message received: ", msg);

            if (instanceOfIConnectionState(msg)) {

                let existingConState = getStoredConnectionById(msg.connectionId);
                switch (msg.status) {
                    case "start":
                        ws.id = msg.connectionId;
                        msg.ws = [ws];
                        connectionsPool.push(msg);

                        setTimeout(() => {
                            msg.status = "inprogress";
                            broadcast(msg);
                        }, 2000);
                        break;
                    case "inprogress":
                        addParticipatingWs(msg.connectionId, ws);

                        if (existingConState) {
                            existingConState.status = msg.status;
                            broadcast(existingConState);
                        } else console.error("In progress signal recieved for a nonexistent connection");
                        break;
                    case "done":
                        addParticipatingWs(msg.connectionId, ws);
                        broadcast(msg);

                        if (existingConState) {
                            existingConState.status = msg.status;
                            closeAll(existingConState);
                        } else console.error("Done signal recieved for a nonexistent connection");
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
    let wss = conState.ws;
    if (!wss) return;

    for (let ws of wss) {
        conState.status = "done";
        ws.send(JSON.stringify(conState));
    }
}

function broadcast(conState: IConnectionState) {
    console.log("Broadcasting: " + conState.status);
    let wss = conState.ws;
    if (!wss) return;

    for (let ws of wss) {
        ws.send(conState.status);
    }
}


interface IConnectionState {
    connectionId: number;
    status: "start" | "inprogress" | "done";
    ws?: any[];
}

function instanceOfIConnectionState(object: any): object is IConnectionState {
    return object.connectionId != undefined;
}