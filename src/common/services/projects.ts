import { fetchBackend, ObjectToPathQuery, match, isReactSnap } from "../helpers";
import { IProject } from "../../interface/IProject";

export async function CreateProject(projectData: IProject): Promise<Response> {
    // Reformat microsoft store links to an international format
    for (let link of projectData.links) {
        const storeId = match(link.url, /http.*microsoft\..*([\w\d]{12})[/|?]?/);
        if (storeId) {
            link.url = `https://www.microsoft.com/store/apps/${storeId}`;
        }
    }

    return await fetchBackend("projects", "POST", projectData);
}

export async function ModifyProject(projectData: IProject, queryData: IModifyProjectRequestQuery) {
    // Reformat microsoft store links to an international format
    for (let link of projectData.links) {
        const storeId = match(link.url, /http.*microsoft\..*([\w\d]{12})[/|?]?/);
        if (storeId) {
            link.url = `https://www.microsoft.com/store/apps/${storeId}`;
        }
    }

    return await fetchBackend(`projects?${ObjectToPathQuery(queryData)}`, "PUT", projectData);
}

export async function DeleteProject(bodyData: IDeleteProjectRequestBody) {
    return await fetchBackend(`projects`, "DELETE", bodyData);
}

export async function GetAllProjects(): Promise<IProject[]> {
    if (isReactSnap)
        return [];

    return (await fetchBackend(`projects`, "GET")).json();
}

export async function GetAllProjects_Unfiltered(): Promise<IProject[]> {
    return (await fetchBackend(`projects?all=true`, "GET")).json();
}

export async function GetLaunchProjects(year: number): Promise<IProject[]> {
    if (isReactSnap)
        return [];

    var request = await fetchBackend(`projects/launch/${year}`, "GET");
    var result = await request.json();

    return result.projects;
}

export interface IModifyProjectRequestQuery {
    /** @summary The app name that's being modified */
    name: string;
}

export interface IDeleteProjectRequestBody {
    /** @summary The app name that's being deleted */
    name: string;
}
