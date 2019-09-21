
import { GetCurrentUser, IDiscordUser, discordAuthEndpoint, AuthData } from "../../common/services/discord";
import { isLocalhost } from "../helpers";
import { backendHost } from "../../common/const";

enum Route {
    Projects = "projects",
    User = "user"
}

enum Method {
    POST = "POST",
    PUT = "PUT"
}

export async function GetCurrentUserId(): Promise<string> {
    let user: IDiscordUser | undefined = await GetCurrentUser();
    if (!user) {
        window.location.href = discordAuthEndpoint;
        return "";
    };
    return user.id;
}

export async function PostUser(requestBody: any): Promise<Response> {
    return await SubmitRequest(Route.User, Method.POST, requestBody);
}

export async function PutUser(requestBody: any): Promise<Response> {
    return await SubmitRequest(Route.User, Method.PUT, requestBody);
}

export async function PostProject(requestBody: any): Promise<Response> {
    return await SubmitRequest(Route.Projects, Method.POST, requestBody);
}

async function SubmitRequest(route: string, method: string, requestBody: any): Promise<Response> {
    let userId = await GetCurrentUserId();
    let authData = await AuthData.Get();
    if (!authData) throw new Error("Auth data not present");

    let url = `http://${backendHost}/${route}`;

    if (requestBody) {
        requestBody.discordId = userId;
    }

    return await fetch(url, {
        headers: { "Content-Type": "application/json", authorization: authData.access_token },
        method: method,
        body: JSON.stringify(requestBody)
    });
}