import { IUser } from "./users";
import { fetchBackend, ObjectToPathQuery, match, useNetwork } from "../helpers";

export async function CreateProject(projectData: ICreateProjectsRequestBody): Promise<Response> {
    // Reformat microsoft store links to an international format
    if (projectData.downloadLink) {
        const storeId = match(projectData.downloadLink, /http.*microsoft\..*([\w\d]{12})[\/|?]?/);
        if (storeId) {
            projectData.downloadLink = `https://www.microsoft.com/store/apps/${storeId}`;
        }
    }
    return await fetchBackend("projects", "POST", projectData);
}
export interface ICreateProjectsRequestBody {
    role: "Developer" | "Other"; // Only a developer or "Other" (manager, etc) can create a new project
    appName: string;
    category: string;
    description: string;
    isPrivate: boolean;
    downloadLink?: string;
    githubLink?: string;
    externalLink?: string;
    launchYear: number;
    awaitingLaunchApproval: boolean;
    needsManualReview: boolean;
    heroImage: string;
    lookingForRoles: string[];
}


export async function ModifyProject(projectData: IModifyProjectsRequestBody, queryData: IModifyProjectRequestQuery) {
    // Reformat microsoft store links to an international format
    if (projectData.downloadLink) {
        const storeId = match(projectData.downloadLink, /http.*microsoft\..*([\w\d]{12})[\/|?]?/);
        if (storeId) {
            projectData.downloadLink = `https://www.microsoft.com/store/apps/${storeId}`;
        }
    }

    return await fetchBackend(`projects?${ObjectToPathQuery(queryData)}`, "PUT", projectData);
}

export async function DeleteProject(bodyData: IDeleteProjectRequestBody) {
    return await fetchBackend(`projects`, "DELETE", bodyData);
}

export async function GetAllProjects(): Promise<IProject[]> {
    return (await fetchBackend(`projects`, "GET")).json();
}

export async function GetLaunchProjects(year: number): Promise<IProject[]> {
    return (await (await fetchBackend(`projects`, "GET")).json()).filter((project: IProject) => project.launchYear == year && project.awaitingLaunchApproval == false);
}

export function useProjects () {
    return useNetwork<IProject>(async (year?: number) => {
        if (!year) {
            return await GetAllProjects()
        } else {
            return await GetLaunchProjects(year)
        }
    })
}

export interface IModifyProjectsRequestBody {
    appName: string;
    description?: string;
    isPrivate: boolean;
    category?: string;

    downloadLink?: string;
    githubLink?: string;
    externalLink?: string;

    collaborators?: IUser[];

    launchYear?: number;
    awaitingLaunchApproval: boolean;
}

export interface IModifyProjectRequestQuery {
    /** @summary The app name that's being modified */
    appName: string;
}

export interface IDeleteProjectRequestBody {
    /** @summary The app name that's being deleted */
    appName: string;
}

export interface IProjectCollaborator extends IUser {
    role: "Developer" | "Translator" | "Beta Tester" | "Other";
}
export interface IProject {
    id?: number;

    appName: string;
    description: string;
    isPrivate: boolean;
    downloadLink?: string;
    githubLink?: string;
    externalLink?: string;

    heroImage: string;

    awaitingLaunchApproval: boolean;
    needsManualReview: boolean;
    lookingForRoles?: string[];

    collaborators: IProjectCollaborator[];

    launchYear?: number;
    category?: string;
};
