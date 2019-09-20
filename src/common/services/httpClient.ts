
import { GetCurrentUser, IDiscordUser, discordAuthEndpoint } from "../../common/services/discord";
import { isLocalhost } from "../helpers";
import { backendHost } from "../../common/const";

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

export async function PostUser(request: any, modifying: boolean): Promise<Response> {
    let method = modifying ? "PUT" : "POST";
    return await SubmitRequest(Route.User, method, request);
}

export async function PostProject(request: any): Promise<Response> {
    return await SubmitRequest(Route.Projects, "POST", request);
}

async function SubmitRequest(route: string, method: string, request: any): Promise<Response> {
    let userId = await GetCurrentUserId();

    let url = BuildUrl(route, userId);

    if (request) {
        request.discordId = userId;
    }

    return await fetch(url, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(request)
    });
}

enum Route {
    Projects = "projects",
    User = "user"
}