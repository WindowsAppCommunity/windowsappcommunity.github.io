import { isLocalhost, backendHost } from "../const";
import { fetchBackend } from "../helpers";

export const uwpCommunityGuildId = 372137812037730304;
export const developerRoleId = 372142246625017871;

export const discordAuthEndpoint = (
    isLocalhost ?
        `https://discordapp.com/api/oauth2/authorize?client_id=611491369470525463&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fsignin%2Fredirect&response_type=code&scope=identify%20guilds`
        :
        `https://discordapp.com/api/oauth2/authorize?client_id=611491369470525463&redirect_uri=http%3A%2F%2Fuwpcommunity-site-backend.herokuapp.com%2Fsignin%2Fredirect&response_type=code&scope=identify%20guilds`
);

export const AuthData = {
    Get: GetDiscordAuthData,
    Set: SetDiscordAuthData,
    Clear: ClearDiscordAuthData
};

export function GetDiscordAuthData(): IDiscordAuthResponse | undefined {
    const authData = localStorage.getItem("discordAuthData");
    if (!authData) return;
    return JSON.parse(authData);
}

export function SetDiscordAuthData(data: IDiscordAuthResponse) {
    if (!data) return;
    localStorage.setItem("discordAuthData", JSON.stringify(data));
}

export function ClearDiscordAuthData() {
    localStorage.removeItem("discordAuthData");
}

export async function RefreshTokenIfNeeded() {
    const UnixTime: number = Math.round((new Date()).getTime() / 1000);
    let auth = AuthData.Get();

    if (!auth) return;

    if (auth.expires_at && auth.expires_at < UnixTime) {
        let refreshData: IDiscordAuthResponse = await (await fetch(`https://${backendHost}/signin/refresh?refreshToken=${auth.refresh_token}`)).json();

        if (refreshData.expires_in) refreshData.expires_at = UnixTime + refreshData.expires_in;

        SetDiscordAuthData(refreshData);
    }
}

export async function IsUserInServer(): Promise<boolean> {
    await RefreshTokenIfNeeded();

    const Auth = AuthData.Get();
    if (!Auth) throw new Error("No auth data found");

    const Req = await fetch("https://discordapp.com/api/v6/users/@me/guilds", {
        headers: {
            "Authorization": "Bearer " + Auth.access_token
        }
    });
    if (Req.status !== 200) return true; // If something goes wrong, give the benefit of the doubt

    const Response: IDiscordGuild[] = await Req.json();

    return Response.filter(server => server.id === "372137812037730304").length > 0;
}

export let CurrentUser: IDiscordUser;
export async function GetCurrentDiscordUser(): Promise<IDiscordUser | undefined> {
    if (CurrentUser) return CurrentUser;

    const Auth = AuthData.Get();
    if (!Auth) return;

    const Req = await fetch("https://discordapp.com/api/v6/users/@me", {
        headers: {
            "Authorization": "Bearer " + Auth.access_token
        }
    });
    if (!Req || Req.status !== 200) return;
    CurrentUser = await Req.json();
    return CurrentUser;
}

export async function GetUserRoles(user: IDiscordUser): Promise<string[] | undefined> {
    user = user || await GetCurrentDiscordUser();

    const request = await fetchBackend("bot/user/roles", "GET");

    if (request && request.status === 200) {
        const result: IDiscordRoleData[] = await request.json();

        return result.map(role => role.name);
    }
}

export async function AssignUserRole(roleName: string, user?: IDiscordUser) {
    return await fetchBackend("bot/user/roles", "PUT", { role: roleName });
}

export async function GetUserAvatar(user?: IDiscordUser): Promise<string | undefined> {
    user = user || await GetCurrentDiscordUser();
    if (!user) return;
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
}

export interface IDiscordUser {
    "username": string;
    "locale"?: string;
    "premium_type"?: number;
    "mfa_enabled": boolean;
    "flags"?: number;
    "avatar": string;
    "discriminator": string;
    "id": string;
}

export interface IDiscordRoleData {
    deleted: boolean;
    id: string;
    name: string;
    color: number;
    hoist: boolean;
    position: number;
    permissions: number;
    managed: boolean;
    mentionable: boolean;
}

export interface IDiscordGuildMember {
    /** @summary the user this guild member represents */
    user: IDiscordUser;
    /** @summary this users guild nickname (if one is set) */
    nick?: string;
    /** @summary array of role object ids @type Snowflake[] */
    roles: string[];
    /** @summary when the user joined the guild */
    joined_at: string;
    /** @summary when the user used their Nitro boost on the server */
    premium_since?: string;
    /** @summary whether the user is deafened in voice channels */
    deaf: boolean;
    /** @summary whether the user is muted in voice channels */
    mute: boolean;
};

export interface IDiscordGuild {
    "owner": boolean,
    "permissions": number,
    "icon": string,
    "id": string,
    "name": string;
}

export interface IDiscordAuthResponse {
    "access_token": string;
    "token_type": "Bearer";
    "expires_in": number;
    "expires_at"?: number;
    "refresh_token": string;
    "scope": string;
}