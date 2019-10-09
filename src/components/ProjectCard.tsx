import { IProject } from "../common/services/projects";
import { DocumentCard, DocumentCardImage, ImageFit, DocumentCardDetails, DocumentCardTitle, Text, Stack, DocumentCardActions, IButtonProps, PrimaryButton, Dialog, FontIcon, DefaultButton } from "office-ui-fabric-react";
import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EditProjectDetailsForm } from "./forms/EditProjectDetailsForm";

enum ButtonType {
  Github, Download, External
}

interface ICustomButtonRenderProps {
  type: ButtonType;
  link: string;
}
const FaIconStyle: React.CSSProperties = {
  color: "black",
  height: "25px",
  width: "25px"
};

export interface IProjectCard {
  project: IProject;
  editable?: boolean;
}

export const ProjectCard = (props: IProjectCard) => {
  const [projectCardActions, setProjectCardActions] = React.useState<IButtonProps[]>([]);
  const [showEditDialog, setShowEditDialog] = React.useState<boolean>(false);
  const [projectViewModel, setProjectViewModel] = React.useState<IProject>(props.project);

  React.useEffect(() => {
    const projectCardsData: IButtonProps[] = [];

    if (projectViewModel.downloadLink) {
      projectCardsData.push({
        data: {
          type: ButtonType.Download,
          link: projectViewModel.downloadLink
        },
        href: projectViewModel.downloadLink,
        onRenderIcon: onRenderIcon
      });
    }

    if (projectViewModel.githubLink) {
      projectCardsData.push({
        data: {
          type: ButtonType.Github,
          link: projectViewModel.githubLink
        },
        href: projectViewModel.githubLink,
        onRenderIcon: onRenderIcon
      });
    }

    if (projectViewModel.externalLink) {
      projectCardsData.push({
        data: {
          type: ButtonType.External,
          link: projectViewModel.externalLink
        },
        href: projectViewModel.externalLink,
        onRenderIcon: onRenderIcon
      });
    }

    setProjectCardActions(projectCardsData);

  }, [projectViewModel.githubLink, projectViewModel.externalLink, projectViewModel.downloadLink]);

  function onRenderIcon(buttonProps: IButtonProps | undefined) {
    if (!buttonProps) return null;
    const buttonData: ICustomButtonRenderProps = buttonProps.data;
    if (!buttonData.link) return null;

    switch (buttonData.type.valueOf()) {
      case ButtonType.Download:
        if (buttonData.link && buttonData.link.includes("microsoft.com")) {
          return <FontAwesomeIcon style={FaIconStyle} icon={["fab", "microsoft"]} />
        } else {
          return <FontAwesomeIcon style={FaIconStyle} icon="arrow-circle-down" />
        }
      case ButtonType.External:
        return <FontAwesomeIcon style={FaIconStyle} icon={["fas", "globe"]} />
      case ButtonType.Github:
        return <FontAwesomeIcon style={FaIconStyle} icon={["fab", "github"]} />
      default: return null;
    }
  }

  return (
    <DocumentCard style={{ width: 275 }}>
      <Dialog dialogContentProps={{ styles: { title: { padding: "16px 16px 5px 24px" } } }} styles={{}} hidden={!showEditDialog} title={`Edit ${projectViewModel.appName}`} onDismiss={() => { setShowEditDialog(false) }}>
        <EditProjectDetailsForm editing projectData={projectViewModel} onSuccess={(updatedProject) => {
          setShowEditDialog(false);
          if (updatedProject) setProjectViewModel(updatedProject);
        }} />
      </Dialog>
      <DocumentCardImage height={150} imageFit={ImageFit.centerCover} imageSrc={projectViewModel.heroImage} />
      <DocumentCardDetails>
        <DocumentCardTitle styles={{ root: { padding: 5, height: "auto" } }} title={projectViewModel.appName} />
        <Stack tokens={{ padding: 10 }}>
          <Text style={{ overflowY: "auto", height: 60 }}>{projectViewModel.description}</Text>
        </Stack>
        <Stack horizontal tokens={{ childrenGap: 5, padding: 5 }} verticalAlign="center">
          {props.editable !== undefined ?
            <PrimaryButton iconProps={{ iconName: "edit", style: { fontSize: 18 } }} style={{ minWidth: 45, padding: 0 }} onClick={() => { setShowEditDialog(true) }} />
            : <></>}

          <DocumentCardActions styles={{ root: { padding: 0 } }} actions={projectCardActions} />
        </Stack>
      </DocumentCardDetails>
    </DocumentCard>
  )
}
