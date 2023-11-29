import { ILink } from "./ILink.js";
import { IUserConnection } from "./IUserConnection.js";
import type { CID } from "multiformats/cid";

export interface IUser {
    name: string;
    markdownAboutMe: string;
    connections: IUserConnection[];
    links: ILink[]
    projects: CID[];
    publishers: CID[];
    forgetMe?: boolean;
}