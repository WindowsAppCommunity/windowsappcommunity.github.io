import { IProject, DeleteProject, ModifyProject, IModifyProjectsRequestBody, IProjectCollaborator } from "../common/services/projects";
import { DocumentCard, ImageFit, DocumentCardDetails, DocumentCardTitle, Text, Stack, DocumentCardActions, IButtonProps, PrimaryButton, Dialog, FontIcon, DefaultButton, DialogType, TooltipHost, TooltipDelay, Modal, Image, Link } from "office-ui-fabric-react";
import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EditProjectDetailsForm } from "./forms/EditProjectDetailsForm";
import { IDiscordUser, GetDiscordUser, AssignUserRole } from "../common/services/discord";
import styled from "styled-components";

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

const PointerOnHover = styled.span`
  &:hover {
    cursor: pointer;
  }
`;

export interface IProjectCard {
  project: IProject;
  editable?: boolean;
  onProjectRemove?: (project: IProject) => void;
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

  const [showProjectDetailsModal, setShowProjectDetailsModal] = React.useState(false);

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
      await AssignLaunchParticipantRole(ViewModel.collaborators.filter(p => p.isOwner)[0]);
      setShowLaunchApprovalDialog(false);
    }
  }

  async function AssignLaunchParticipantRole(user: IProjectCollaborator) {
    const roleAssignReq = await AssignUserRole("Launch Participant", user.discordId);
    if (roleAssignReq && roleAssignReq.ok === false) {
      setShowLaunchApproveProjectDialogErrorMessage(`Project was approved, but the user couldn't be assigned the Launch Participant role. (Error: ${(await roleAssignReq.json()).reason})`);
    }
  }

  return (
    <DocumentCard style={{ width: 275 }}>

      <Modal styles={{ root: { maxWidth: "100vw" } }} onDismiss={() => setShowProjectDetailsModal(false)} isOpen={showProjectDetailsModal}>
        <Stack>
          <Stack tokens={{ padding: "7px 10px" }}>
            <Stack horizontal horizontalAlign="space-between" style={{ padding: "0px 0px 2px 0px", marginBottom: "10px" }}>
              <Text variant="xxLarge" style={{ fontWeight: 400 }}>{ViewModel.appName}</Text>

              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 5 }}>
                {projectOwner ?
                  (<>
                    <Text variant="smallPlus">{ViewModel.collaborators.filter(i => i.isOwner)[0].name}</Text>
                    <Text> | </Text>
                    <Text variant="smallPlus">{projectOwner.username}#{projectOwner.discriminator}</Text>
                  </>) : <>No owner data</>}
                <Link style={{ margin: 10 }} onClick={() => setShowProjectDetailsModal(false)}>
                  <FontIcon style={{ fontSize: 16, color: "black" }} iconName="ChromeClose" />
                </Link>
              </Stack>
            </Stack>

            <Text style={{ maxWidth: 1190 }} variant="medium">{ViewModel.description}</Text>

          </Stack>
          <div>
            <Image style={{ borderTop: "2px solid midnightblue", width: "auto" }} width={1200} height={675} src={ViewModel.heroImage} imageFit={ImageFit.contain} />
          </div>
        </Stack>
      </Modal>

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
              if (props.onProjectRemove) props.onProjectRemove(ViewModel);
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

      <PointerOnHover>
        <Image onClick={() => {
          GetDiscordUser(ViewModel.collaborators.filter(collaborator => collaborator.isOwner)[0].discordId)
            .then(owner => {
              setProjectOwner(owner);
              setShowProjectDetailsModal(true)
            });
        }}
          height={150} imageFit={ImageFit.centerCover} src={ViewModel.heroImage} />
      </PointerOnHover>

      <DocumentCardDetails>
        <Stack horizontal tokens={{ padding: 5 }} verticalAlign="center">
          {ViewModel.needsManualReview ?
            <TooltipHost content="Waiting for approval" delay={TooltipDelay.zero}>
              <FontIcon style={{ fontSize: 20, padding: "0px 5px" }} iconName="Manufacturing" />
            </TooltipHost>
            : <></>}
          {(ViewModel.awaitingLaunchApproval && props.modOptions) || ViewModel.launchYear ?
            <TooltipHost content={ViewModel.launchYear ? `Launch ${ViewModel.launchYear} participant` : "Awaiting Launch approval"} delay={TooltipDelay.zero}>
              <FontIcon style={{ fontSize: 20, padding: "0px 5px" }} iconName="Rocket" />
            </TooltipHost>
            : <></>}
          <DocumentCardTitle styles={{ root: { padding: "5px 5px", height: "auto", fontWeight: 600 } }} title={ViewModel.appName} />
        </Stack>
        <Stack tokens={{ padding: "0px 10px 10px 10px" }}>
          <Text style={{ overflowY: "auto", height: 60 }}>{ViewModel.description}</Text>
        </Stack>
        <Stack horizontal tokens={{ childrenGap: 5, padding: 5 }} verticalAlign="center">
          {props.editable !== undefined ? (<>
            <PrimaryButton iconProps={{ iconName: "edit", style: { fontSize: 14 } }} style={{ minWidth: 45, padding: 0 }} onClick={() => { setShowEditDialog(true) }} />
            <PrimaryButton iconProps={{ iconName: "delete", style: { fontSize: 14 } }} style={{ minWidth: 45, padding: 0 }} onClick={() => { setShowDeleteProjectDialog(true) }} />
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
