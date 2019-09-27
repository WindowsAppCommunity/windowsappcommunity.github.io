import { IUser } from "./users";

export interface IProject {
    id?: number;

    appName: string;
    description: string;
    isPrivate: boolean;
    downloadLink?: string;
    githubLink?: string;
    externalLink?: string;

    collaborators: IUser[];

    launchYear?: number;
    category?: string;
};