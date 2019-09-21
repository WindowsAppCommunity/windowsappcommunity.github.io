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

export interface IBackendReponseError {
  error: string;
  reason: string;
}