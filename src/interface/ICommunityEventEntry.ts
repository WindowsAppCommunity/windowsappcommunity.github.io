import type { CID } from "multiformats/cid";

export interface ICommunityEventEntry {
    event: CID;
    project: CID;
    year: number;
}
