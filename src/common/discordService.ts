import { IDiscordAuthResponse } from "./interfaces";
import Discord from 'discord.js';

export let DiscordClient: Discord.Client;

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

export async function Init() {
    const UnixTime: number = Math.round((new Date()).getTime() / 1000);
    let auth = AuthData.Get();
    console.log("Initializing login service");
    if (!auth) return;

    if (auth.expires_at && auth.expires_at < UnixTime) {
        let refreshData: IDiscordAuthResponse = await (await fetch("https://uwpcommunity-site-backend.herokuapp.com/signin/refresh?refreshToken=" + auth.refresh_token)).json();

        if (refreshData.expires_in) refreshData.expires_at = UnixTime + refreshData.expires_in;

        console.log(refreshData);
        SetDiscordAuthData(refreshData);
        Init();
    }
    DiscordClient = new Discord.Client();
    DiscordClient.login(auth.access_token);

}
