import type { CID } from "multiformats/cid";

export interface ICommunityEvent {
    name: string;
    entries: CID[];
}