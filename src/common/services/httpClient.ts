
import { GetCurrentUser, IDiscordUser, discordAuthEndpoint } from "../../common/services/discord";
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

function BuildUrl(route: string, userId: string): string {
    if (isLocalhost) {
        return `http://${backendHost}/${route}?accessToken=admin`;
    } else {
        return `https://${backendHost}/${route}?accessToken=${userId}`;
    }
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

    let url = BuildUrl(route, userId);

    if (requestBody) {
        requestBody.discordId = userId;
    }

    return await fetch(url, {
        headers: { "Content-Type": "application/json" },
        method: method,
        body: JSON.stringify(requestBody)
    });
}