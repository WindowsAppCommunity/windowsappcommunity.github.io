import { IUser } from "./users";
import { fetchBackend, ObjectToPathQuery, match, isReactSnap } from "../helpers";
import { useState } from "react";

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

export interface IProjectsState {
    projects?: IProject[]
    error?: Error
    isLoading: boolean
}

export function useProjects(year?: number): [IProjectsState, () => Promise<void>] {
    const cacheKey = 'loadedProjects' + (year || '')
    const cache: IProject[] = (window as any)[cacheKey]
    const initialState: IProjectsState = { isLoading: false }

    if (!isReactSnap && cache && cache.length) {
        initialState.projects = cache
    }

    const [res, setRes] = useState<IProjectsState>(initialState)

    const getProjects = async () => {
        setRes(prevState => ({ ...prevState, isLoading: true }))

        let projects: IProject[]
        try {
            if (!year) {
                projects = await GetAllProjects()
            } else {
                projects = await GetLaunchProjects(year)
            }
            setRes(prevState => ({ ...prevState, isLoading: false, projects }))

            /* if (isReactSnap) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.innerHTML = `window['${cacheKey}'] = ${JSON.stringify(projects)}`;
                document.getElementsByTagName('head')[0].appendChild(script);
            } */
        } catch (error) {
            setRes(prevState => ({ ...prevState, isLoading: false, error }))
        }
    }

    return [res, getProjects]
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
