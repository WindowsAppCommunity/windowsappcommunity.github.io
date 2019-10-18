import { IProject, DeleteProject, ModifyProject, IModifyProjectsRequestBody } from "../common/services/projects";
import { DocumentCard, DocumentCardImage, ImageFit, DocumentCardDetails, DocumentCardTitle, Text, Stack, DocumentCardActions, IButtonProps, PrimaryButton, Dialog, FontIcon, DefaultButton, DialogType, DialogFooter, TooltipHost, TooltipDelay } from "office-ui-fabric-react";
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
  onProjectDelete?: () => void;
  modOptions?: boolean;
}

export const ProjectCard = (props: IProjectCard) => {
  const [projectCardActions, setProjectCardActions] = React.useState<IButtonProps[]>([]);
  const [showEditDialog, setShowEditDialog] = React.useState<boolean>(false);
  const [showDeleteProjectDialog, setShowDeleteProjectDialog] = React.useState(false);

  const [showManualApproveProjectDialog, setShowManualApproveProjectDialog] = React.useState(false);
  const [showManualApproveProjectDialogErrorMessage, setShowManualApproveProjectDialogErrorMessage] = React.useState<string>("");

  const [showLaunchApprovalDialog, setShowLaunchApprovalDialog] = React.useState(false);
  const [showLaunchApproveProjectDialogErrorMessage, setShowLaunchApproveProjectDialogErrorMessage] = React.useState<string>("");

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

  async function ManuallyApproveProject() {
    const data: IModifyProjectsRequestBody = {
      needsManualReview: false,
      appName: ViewModel.appName,
      description: ViewModel.description,
      heroImage: ViewModel.heroImage,
      awaitingLaunchApproval: ViewModel.awaitingLaunchApproval,
      isPrivate: ViewModel.isPrivate
    };
    setProjectViewModel({ ...ViewModel, ...data });

    const req = await ModifyProject(data, { appName: ViewModel.appName });
    if (req.status !== 200) {
      setShowManualApproveProjectDialogErrorMessage((await req.json()).reason);
    } else {
      setShowManualApproveProjectDialog(false);
    }
  }

  async function ApproveLaunchSubmission(launchYear: number) {
    const data: IModifyProjectsRequestBody = {
      appName: ViewModel.appName,
      description: ViewModel.description,
      needsManualReview: ViewModel.needsManualReview,
      isPrivate: ViewModel.isPrivate,
      heroImage: ViewModel.heroImage,
      awaitingLaunchApproval: false,
      launchYear
    };
    setProjectViewModel({ ...ViewModel, ...data });

    const req = await ModifyProject(data, { appName: ViewModel.appName });
    if (req.status !== 200) {
      setShowLaunchApproveProjectDialogErrorMessage((await req.json()).reason);
    } else {
      setShowLaunchApprovalDialog(false);
    }
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
              await DeleteProject({ appName: ViewModel.appName });
              setShowDeleteProjectDialog(false);
              if (props.onProjectDelete) props.onProjectDelete();
            }} />
          <PrimaryButton onClick={() => { setShowDeleteProjectDialog(false); }} text="Cancel" />
        </Stack>
      </Dialog>

      <Dialog hidden={!showManualApproveProjectDialog}
        dialogContentProps={{
          styles: { title: { padding: "16px 16px 8px 24px", fontSize: 20 }, subText: { fontSize: 16 } },
          type: DialogType.largeHeader,
          title: `Approve this project?`,
          subText: projectOwner ? `${ViewModel.appName} belongs to ${projectOwner.username}#${projectOwner.discriminator}` : "Project owner info not avilable"
        }}
        onDismiss={() => { setShowManualApproveProjectDialog(false) }}>
        <Stack>
          <Text style={{ color: "red" }}>{showManualApproveProjectDialogErrorMessage}</Text>
          <Stack horizontal tokens={{ childrenGap: 7 }}>
            <PrimaryButton text={`Confirm`}
              onClick={async () => {
                await ManuallyApproveProject();
              }} />
            <DefaultButton onClick={() => { setShowManualApproveProjectDialog(false); }} text="Cancel" />
          </Stack>
        </Stack>
      </Dialog>

      <Dialog hidden={!showLaunchApprovalDialog}
        dialogContentProps={{
          styles: { title: { padding: "16px 16px 8px 24px", fontSize: 20 }, subText: { fontSize: 16 } },
          type: DialogType.largeHeader,
          title: `Approve launch submission?`,
          subText: projectOwner ?
            `${ViewModel.appName} belongs to ${projectOwner.username}#${projectOwner.discriminator}. Follow up with them to ensure the project is eligible for the Launch event` : "Project owner info not avilable"
        }}
        onDismiss={() => { setShowLaunchApprovalDialog(false) }}>
        <Stack>
          <Text style={{ color: "red" }}>{showLaunchApproveProjectDialogErrorMessage}</Text>
          <Stack horizontal tokens={{ childrenGap: 7 }}>
            <PrimaryButton text={`Confirm`}
              onClick={async () => {
                await ApproveLaunchSubmission(2020);
              }} />
            <DefaultButton onClick={() => { setShowLaunchApprovalDialog(false); }} text="Cancel" />
          </Stack>
        </Stack>
      </Dialog>

      <DocumentCardImage height={150} imageFit={ImageFit.centerCover} imageSrc={ViewModel.heroImage} />
      <DocumentCardDetails>
        <Stack horizontal tokens={{ padding: 5 }} verticalAlign="center">
          {ViewModel.needsManualReview ?
            <TooltipHost content="Waiting for approval" delay={TooltipDelay.zero}>
              <FontIcon style={{ fontSize: 26, padding: "0px 5px" }} iconName="Manufacturing" />
            </TooltipHost>
            : <></>}
          {ViewModel.awaitingLaunchApproval ?
            <TooltipHost content="Awaiting Launch approval" delay={TooltipDelay.zero}>
              <FontIcon style={{ fontSize: 24, padding: "0px 5px" }} iconName="Rocket" />
            </TooltipHost>
            : <></>}
          <DocumentCardTitle styles={{ root: { padding: "0px 5px", height: "auto" } }} title={ViewModel.appName} />
        </Stack>
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
                  setShowManualApproveProjectDialog(true);
                });
            }} />
          </>) : <></>}

          {props.modOptions !== undefined && ViewModel.awaitingLaunchApproval && !ViewModel.needsManualReview ? (<>
            <PrimaryButton iconProps={{ iconName: "Rocket", style: { fontSize: 20 } }} style={{ minWidth: 35, padding: 0 }} onClick={() => {
              GetDiscordUser(ViewModel.collaborators.filter(collaborator => collaborator.isOwner)[0].discordId)
                .then(owner => {
                  setProjectOwner(owner);
                  setShowLaunchApprovalDialog(true);
                });
            }} />
          </>) : <></>}

          <DocumentCardActions styles={{ root: { padding: 0 } }} actions={projectCardActions} />
        </Stack>
      </DocumentCardDetails>
    </DocumentCard>
  )
}
