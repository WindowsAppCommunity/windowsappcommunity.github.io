import type { CID } from "multiformats/cid";
import { IRole } from "./IRole.js";

export interface ICollaborator {
    user: CID;
    role: IRole;
}
