export interface IUserConnection {
    connectionName: string;
}

export interface IDiscordConnection extends IUserConnection {
    connectionName: "discord";
    discordId: string;
}

export interface IEmailConnection extends IUserConnection {
    connectionName: "email";
    email: string;
}