export const getSreenshotUrl = (id: string) => {
  return "assets/screenshots/"+id+".png";
}

export const getStoreUrl = (id: string) => {
  return "https://www.microsoft.com/store/apps/"+id;
}

export const getGitHubUrl = (id: string) => {
  return "https://github.com/"+id;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  github: string;
  store: string;
}

export interface ProjectList {
  projects: Project[];
}

export const ProjectListConst: ProjectList = {
  projects: [
    {
      id: "filesUwp",
      title: "Files UWP",
      description: "More than just a rewrite of Windows Explorer",
      category: "",
      github: "duke7553/files-uwp",
      store: ""
    },
    {
      id: "breadPlayer",
      title: "Bread Player",
      description: "Sleek & polish designed alternative to Groove and WMP",
      category: "",
      github: "theweavrs/BreadPlayer",
      store: "9nblggh42srx"
    },
    {
      id: "id",
      title: "title",
      description: "description",
      category: "category",
      github: "github",
      store: "store"
    }
  ]
};
