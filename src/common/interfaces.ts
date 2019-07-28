export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  github: string;
  store: string;
  // discord: string | null | undefined;
}

export interface ProjectList {
  projects: Project[];
}