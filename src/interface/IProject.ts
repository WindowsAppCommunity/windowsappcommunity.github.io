import type { CID } from "multiformats/cid";
import { ICollaborator } from "./ICollaborator.js";
import { ILink } from "./ILink.js";

export interface IProject {
    publisher: CID;
    name: string;
    description: string;
    icon: CID;
    heroImage: CID;
    images: CID[];
    features: string[];
    accentColor: string;
    category: string;
    createdAtUnixTime: number;
    dependencies: CID[];
    collaborators: ICollaborator[];
    links: ILink[];
    forgetMe: boolean;
    isPrivate: boolean;
    needsManualReview: boolean;
}
