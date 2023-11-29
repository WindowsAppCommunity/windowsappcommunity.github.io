import { IProject } from "../../interface/IProject";
import { IUser } from "../../interface/IUser";
import { fetchBackend } from "../helpers";
import type { CID } from "multiformats/cid";
import { Dag, Ipns } from "./helia";
import { peerIdFromString } from "@libp2p/peer-id";

export async function CreateUser(userData: IUser): Promise<Response> {
    return await fetchBackend("user", "POST", userData);
}

export async function ModifyUser(userData: IUser) {
    return await fetchBackend("user", "PUT", userData);
}

export async function GetUserByDiscordId(discordId: string) {
    return await fetchBackend(`user/${discordId}`, "GET");
}

export async function GetUser(ipnsCid: CID) {
    if (!Ipns) {
        console.error("Ipns not found while retrieving user");
        return;
      }
  
      if (!Dag) {
        console.error("Dag not found while retrieving user");
        return;
      }
  
      var userCid = await Ipns.resolve(peerIdFromString(ipnsCid.toString()));
      var user = await Dag.get(userCid) as IUser;

      return user;
}

export async function GetUserProjects(discordId: string): Promise<IProject[]> {
    return (await fetchBackend(`user/${discordId}/projects`, "GET")).json();
}
