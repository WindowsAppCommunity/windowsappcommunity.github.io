import { IProject, DeleteProject, ModifyProject, IModifyProjectsRequestBody } from "../common/services/projects";
import { DocumentCard, DocumentCardImage, ImageFit, DocumentCardDetails, DocumentCardTitle, Text, Stack, DocumentCardActions, IButtonProps, PrimaryButton, Dialog, FontIcon, DefaultButton, DialogType, DialogFooter } from "office-ui-fabric-react";
import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EditProjectDetailsForm } from "./forms/EditProjectDetailsForm";
import { IDiscordUser, GetDiscordUser } from "../common/services/discord";

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
  modOptions?: boolean;
}

export const ProjectCard = (props: IProjectCard) => {
  const [projectCardActions, setProjectCardActions] = React.useState<IButtonProps[]>([]);
  const [showEditDialog, setShowEditDialog] = React.useState<boolean>(false);
  const [showDeleteProjectDialog, setShowDeleteProjectDialog] = React.useState(false);
  const [showApproveProjectDialog, setShowApproveProjectDialog] = React.useState(false);
  const [ViewModel, setProjectViewModel] = React.useState<IProject>(props.project);
  const [projectOwner, setProjectOwner] = React.useState<IDiscordUser>();

  React.useEffect(() => {
    const projectCardsData: IButtonProps[] = [];

    if (ViewModel.downloadLink) {
      projectCardsData.push({
        data: {
          type: ButtonType.Download,
          link: ViewModel.downloadLink
        },
        href: ViewModel.downloadLink,
        onRenderIcon: onRenderIcon
      });
    }

    if (ViewModel.githubLink) {
      projectCardsData.push({
        data: {
          type: ButtonType.Github,
          link: ViewModel.githubLink
        },
        href: ViewModel.githubLink,
        onRenderIcon: onRenderIcon
      });
    }

    if (ViewModel.externalLink) {
      projectCardsData.push({
        data: {
          type: ButtonType.External,
          link: ViewModel.externalLink
        },
        href: ViewModel.externalLink,
        onRenderIcon: onRenderIcon
      });
    }

    setProjectCardActions(projectCardsData);

  }, [ViewModel.githubLink, ViewModel.externalLink, ViewModel.downloadLink]);

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

  async function ApproveProject() {
    const data: IModifyProjectsRequestBody = { appName: ViewModel.appName, needsManualReview: false, isPrivate: ViewModel.isPrivate, heroImage: ViewModel.heroImage, awaitingLaunchApproval: ViewModel.awaitingLaunchApproval };
    setProjectViewModel({ ...ViewModel, ...data });
    await ModifyProject(data, { appName: ViewModel.appName });
  }

  return (
    <DocumentCard style={{ width: 275 }}>

      <Dialog hidden={!showEditDialog} title={`Edit ${ViewModel.appName}`}
        dialogContentProps={{
          styles: { title: { padding: "16px 16px 5px 24px", margin: 0 } },
          type: DialogType.largeHeader
        }}
        onDismiss={() => {
          setShowEditDialog(false)
        }}>
        <EditProjectDetailsForm editing projectData={ViewModel} onSuccess={(updatedProject) => {
          setShowEditDialog(false);
          if (updatedProject) setProjectViewModel(updatedProject);
        }} />
      </Dialog>
      <Dialog hidden={!showDeleteProjectDialog}
        dialogContentProps={{
          styles: { title: { padding: "16px 16px 8px 24px", fontSize: 20 }, subText: { fontSize: 16 } },
          type: DialogType.largeHeader,
          title: `Are you sure?`,
          subText: `This action can't be undone`
        }}
        onDismiss={() => { setShowDeleteProjectDialog(false) }}>
        <Stack horizontal tokens={{ childrenGap: 7 }}>
          <DefaultButton style={{ backgroundColor: "#cc0000", color: "#fff", borderColor: "#cc0000" }} text={`Yes, delete`}
            onClick={async () => {
              await DeleteProject({ appName: ViewModel.appName }); setShowDeleteProjectDialog(false);
            }} />
          <PrimaryButton onClick={() => { setShowDeleteProjectDialog(false); }} text="Cancel" />
        </Stack>
      </Dialog>

      <Dialog hidden={!showApproveProjectDialog}
        dialogContentProps={{
          styles: { title: { padding: "16px 16px 8px 24px", fontSize: 20 }, subText: { fontSize: 16 } },
          type: DialogType.largeHeader,
          title: `Approve this project?`,
          subText: projectOwner ? `${ViewModel.appName} belongs to ${projectOwner.username}#${projectOwner.discriminator}` : "Project owner info not avilable"
        }}
        onDismiss={() => { setShowApproveProjectDialog(false) }}>
        <Stack horizontal tokens={{ childrenGap: 7 }}>
          <PrimaryButton text={`Confirm`}
            onClick={async () => {
              await ApproveProject();
              setShowApproveProjectDialog(false);
            }} />
          <DefaultButton onClick={() => { setShowApproveProjectDialog(false); }} text="Cancel" />
        </Stack>
      </Dialog>

      <DocumentCardImage height={150} imageFit={ImageFit.centerCover} imageSrc={ViewModel.heroImage} />
      <DocumentCardDetails>
        <DocumentCardTitle styles={{ root: { padding: 5, height: "auto" } }} title={ViewModel.appName} />
        <Stack tokens={{ padding: 10 }}>
          <Text style={{ overflowY: "auto", height: 60 }}>{ViewModel.description}</Text>
        </Stack>
        <Stack horizontal tokens={{ childrenGap: 5, padding: 5 }} verticalAlign="center">

          {props.editable !== undefined ? (<>
            <PrimaryButton iconProps={{ iconName: "edit", style: { fontSize: 18 } }} style={{ minWidth: 45, padding: 0 }} onClick={() => { setShowEditDialog(true) }} />
            <PrimaryButton iconProps={{ iconName: "delete", style: { fontSize: 18 } }} style={{ minWidth: 45, padding: 0 }} onClick={() => { setShowDeleteProjectDialog(true) }} />
          </>) : <></>}

          {props.modOptions !== undefined && ViewModel.needsManualReview ? (<>
            <PrimaryButton iconProps={{ iconName: "Ferry", style: { fontSize: 20 } }} style={{ minWidth: 35, padding: 0 }} onClick={() => {
              GetDiscordUser(ViewModel.collaborators.filter(collaborator => collaborator.isOwner)[0].discordId)
                .then(owner => {
                  setProjectOwner(owner);
                  setShowApproveProjectDialog(true);
                });
            }} />
          </>) : <></>}
          <DocumentCardActions styles={{ root: { padding: 0 } }} actions={projectCardActions} />
        </Stack>
      </DocumentCardDetails>
    </DocumentCard>
  )
}
