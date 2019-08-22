import { IDiscordAuthResponse } from "./interfaces";

export const getStoreUrl = (id: string) => {
    return `https://www.microsoft.com/store/apps/${id}`;
}

export const getGithubUrl = (id: string) => {
    return `https://www.github.com/${id}`;
}

export const getDiscordUrl = (id: string) => {
    return `https://www.discord.gg/${id}`;
}

const AuthData = {
    Get: GetDiscordAuthData,
    Set: SetDiscordAuthData,
    Clear: ClearDiscordAuthData
};

export function GetDiscordAuthData() : IDiscordAuthResponse | undefined {
    const authData = localStorage.getItem("discordAuthData");
    if(!authData) return;
    return JSON.parse(authData);
}

export function SetDiscordAuthData(data: IDiscordAuthResponse) {
    if(!data) return;
    localStorage.setItem("discordAuthData", JSON.stringify(data));
}

export function ClearDiscordAuthData() {
    localStorage.removeItem("discordAuthData");
}

export default {
    getDiscordUrl, getGithubUrl, getStoreUrl, AuthData
}