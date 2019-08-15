import { Request } from "express";
import { stat } from "fs";

let verificationQueue: IConnectionState[] = [];

module.exports = function (expressWs: any, endpoint: string) {

    return (ws: any, req: Request) => {
        console.log("Websocket established with " + req.ip);

        ws.on('message', function (msg: IConnectionState) {
            if (instanceOfIConnectionState(msg)) {
                let existingConState = getStoredConnectionById(msg.id);
                switch (msg.status) {
                    case "start":
                        verificationQueue.push(msg);
                        addParticipatingAddress(msg.id, req.ip);
                        break;
                    case "inprogress":
                        addParticipatingAddress(msg.id, req.ip)

                        if (existingConState) {
                            existingConState.status = msg.status;
                            broadcast(existingConState, expressWs, endpoint);
                        } else console.error("In progress signal recieved for a nonexistent connection");
                        break;
                    case "done":
                        addParticipatingAddress(msg.id, req.ip)
                        broadcast(msg, expressWs, endpoint);

                        if (existingConState) {
                            existingConState.status = msg.status;
                            closeAll(existingConState, expressWs, endpoint);
                        } else console.error("Done signal recieved for a nonexistent connection");
                        break;
                }
            }
        });
    };
};

function addParticipatingAddress(id: Number, address: string) {
    for (let item of verificationQueue) {
        if (item.id == id) {
            item.participatingAddresses.push(address);
        }
    }
}

function getStoredConnectionById(id: Number): IConnectionState | undefined {
    let connectionMatches: IConnectionState[] = verificationQueue.filter(state => state.id == id);
    if (connectionMatches[0]) return connectionMatches[0];
}

function closeAll(conState: IConnectionState, wsExpress: any, endpoint: string) {
    let connections: any[] = wsExpress.getWss(endpoint).clients;

    for (let connection of connections) {
        for (let address in conState.participatingAddresses) {
            if (connection.remoteAddress == address) {
                conState.status = "done";
                connection.send(conState);
                connection.terminate();
            }
        }
    }
}

function broadcast(status: IConnectionState, wsExpress: any, endpoint: string) {
    let connections: any[] = wsExpress.getWss(endpoint).clients;

    for (let connection of connections) {
        for (let address in status.participatingAddresses) {
            if (connection.remoteAddress == address) {
                connection.send(status);
            }
        }
    }
}

interface IConnectionState {
    id: Number;
    status: "start" | "inprogress" | "done";
    participatingAddresses: string[];
}

function instanceOfIConnectionState(object: any): object is IConnectionState {
    return 'id' in object;
}