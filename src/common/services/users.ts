import { fetchBackend } from "../helpers";
import { IProject } from "./projects";

export async function CreateUser(userData: IUser): Promise<Response> {
    return await fetchBackend("user", "POST", userData);
}

export async function ModifyUser(userData: IUser) {
    return await fetchBackend("user", "PUT", userData);
}

export async function GetUser(discordId: string) {
    return await fetchBackend(`user/${discordId}`, "GET");
}

export async function GetUserProjects(discordId: string): Promise<IProject[]> {
    return (await fetchBackend(`user/${discordId}/projects`, "GET")).json();
}
export interface IUser {
    name: string;
    discordId: string;
    email?: string; // This is a contact email supplied by the user, and is safe to be public 
}