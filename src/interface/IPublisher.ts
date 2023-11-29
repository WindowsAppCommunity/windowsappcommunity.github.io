import { ILink } from "./ILink.js";
import type { CID } from "multiformats/cid";

export interface IPublisher {
    name: string;
    description: string;
    icon: CID;
    accentColor: string;
    links: ILink[];
    contactEmail: string;
    projects: CID[];
    isPrivate: boolean;
}
