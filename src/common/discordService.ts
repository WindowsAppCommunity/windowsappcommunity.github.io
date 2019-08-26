import { IDiscordAuthResponse } from "./interfaces";

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
    if (!auth) throw new Error("Auth data missing, login service not initialized");

    if (auth.expires_at && auth.expires_at < UnixTime) {
        let refreshData: IDiscordAuthResponse = await (await fetch("https://uwpcommunity-site-backend.herokuapp.com/signin/refresh?refreshToken=" + auth.refresh_token)).json();

        if (refreshData.expires_in) refreshData.expires_at = UnixTime + refreshData.expires_in;

        console.log(refreshData);
        SetDiscordAuthData(refreshData);
        await Init();
    }
    
}
 
export async function IsUserInServer() : Promise<boolean> {
    const Auth = AuthData.Get();
    if(!Auth) throw new Error("No auth data found");

    const Req = await fetch("https://discordapp.com/api/v6/users/@me/guilds", {
             headers: {
                "Authorization": Auth.access_token
             }
    });
    const Response : IDiscordGuild[] = await Req.json();
    
    return Response.filter(server=> server.id === "372137812037730304").length > 0;
}



interface IDiscordGuild {
    "owner": boolean,
    "permissions": number,
    "icon": string,
    "id": string,
    "name": string;
}