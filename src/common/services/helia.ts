import * as helia from 'helia'
import { extractPublicKey } from "ipns"
import type { Helia as HeliaInterface } from '@helia/interface'
import { dagJson, type DAGJSON } from '@helia/dag-json'
import { IPNS, ipns } from '@helia/ipns'
import { IDBBlockstore } from 'blockstore-idb'
import { IDBDatastore } from 'datastore-idb'
import { unixfs, UnixFS } from '@helia/unixfs'

let Helia: HeliaInterface | undefined;
let Ipns: IPNS | undefined;
let Dag: DAGJSON | undefined;
let Fs: UnixFS | undefined;

let isInitialized = false;

export { Helia, Ipns, Dag, Fs };

export async function InitAsync() {
    if (isInitialized)
        return;

    Helia ??= await helia.createHelia({
        start: true,
        blockstore: CreateBlockstore(),
        datastore: CreateDatastore()
    });

    console.log(`Helia is ready with peer id ${Helia.libp2p.peerId}`);

    Ipns ??= await ipns(Helia);
    console.log("Ipns is ready")

    Dag ??= dagJson(Helia);
    console.log("Dag-Json is ready");

    Fs ??= unixfs(Helia);

    isInitialized = true;
}

function CreateBlockstore() {
    var blockstoreLocation = window.localStorage.getItem("blockstore");

    if (blockstoreLocation === null) {
        window.localStorage.setItem("blockstore", blockstoreLocation = "");
    }

    return new IDBBlockstore(blockstoreLocation);
}

function CreateDatastore() {
    var datastoreLocation = window.localStorage.getItem("datastore");

    if (datastoreLocation === null) {
        window.localStorage.setItem("datastore", datastoreLocation = "");
    }

    return new IDBDatastore(datastoreLocation);
}