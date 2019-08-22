import { Request } from "express";

let connectionsPool: IConnectionState[] = [];

module.exports = function (expressWs: any, endpoint: string) {
    return (ws: any, req: Request) => {
        console.log("Websocket established");

        ws.on('close', function close() {
            console.log('disconnected');
        });

        ws.on('message', function (data: string) {
            let msg: IConnectionState = JSON.parse(data);
            console.log("WS Message received: ", msg);

            if (instanceOfIConnectionState(msg)) {
                let existingConState = getStoredConnectionById(msg.connectionId);

                switch (msg.status) {
                    case "start":
                        ws.id = msg.connectionId;
                        msg.ws = [ws];
                        connectionsPool.push(msg);
                        break;
                    case "done":
                        addParticipatingWs(msg.connectionId, ws);

                        if (existingConState) {
                            closeAll(msg);
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

    broadcast(conState);

    setTimeout(() => {

        for (let i = 0; i < connectionsPool.length; i++) {
            if (connectionsPool[i].connectionId == conState.connectionId) {
                connectionsPool.splice(i, 1);
            }
        }
    }, 500);
}

function broadcast(conState: IConnectionState) {
    console.log("Broadcasting: " + JSON.stringify(conState));

    conState.ws = undefined;

    for (let con of connectionsPool) {
        if (con.connectionId == conState.connectionId && con.ws) {
            for (let ws of con.ws) {
                ws.send(JSON.stringify(conState));
            }
        }
    }
}


interface IConnectionState {
    connectionId: number;
    status: "start" | "done";
    ws?: any[];
    code?: string;
}

function instanceOfIConnectionState(object: any): object is IConnectionState {
    return object.connectionId != undefined;
}