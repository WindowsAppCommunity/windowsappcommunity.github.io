export interface IProject {
  id: string;
  title: string;
  description: string;
  category: string;
  github: string;
  store: string;
  discord?: string;
}

export interface IProjectList {
  projects: IProject[];
}


export interface IDiscordAuthResponse {
  "access_token": string;
  "token_type": "Bearer";
  "expires_in": number;
  "expires_at"?: number;
  "refresh_token": string;
  "scope": string;
}
