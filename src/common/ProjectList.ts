const baseProductionCdnUrl =
  "https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/";

export interface Project {
  label: string;
  img: string;
}

export interface ProjectList {
  projects: Project[];
}

export const ProjectListConst: ProjectList = {
  projects: [
    {
      label: "hello",
      img: baseProductionCdnUrl + "document-preview.png"
    },
    {
      label: "world",
      img: baseProductionCdnUrl + "document-preview2.png"
    },
    {
      label: "world2",
      img: baseProductionCdnUrl + "document-preview3.png"
    }
  ]
};
