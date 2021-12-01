import { IProject, DeleteProject, ModifyProject, IModifyProjectsRequestBody, IProjectCollaborator } from "../common/services/projects";
import { DocumentCard, ImageFit, DocumentCardDetails, DocumentCardTitle, Text, Stack, DocumentCardActions, IButtonProps, PrimaryButton, Dialog, FontIcon, DefaultButton, DialogType, TooltipHost, TooltipDelay, Modal, Image, Link } from "office-ui-fabric-react";
import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EditProjectDetailsForm } from "./forms/EditProjectDetailsForm";
import { IDiscordUser, GetDiscordUser, AssignUserRole } from "../common/services/discord";
import styled from "styled-components";
import { fetchBackend, ObjectToPathQuery } from "../common/helpers";

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
  const [width, setWindowWidth] = React.useState<number>(0)

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
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const projectCardsData: IButtonProps[] = [];

    if (ViewModel.downloadLink) {
      const microsoftStoreLinkLabel = "View " + ViewModel.appName + " on the Microsoft Store";
      projectCardsData.push({
        data: {
          type: ButtonType.Download,
          link: ViewModel.downloadLink
        },
        href: ViewModel.downloadLink,
        "aria-label": microsoftStoreLinkLabel,
        target: "_blank",
        onRenderIcon: onRenderIcon
      });
    }

    if (ViewModel.githubLink) {
      const gitHubLinkLabel = "View " + ViewModel.appName + " on GitHub";
      projectCardsData.push({
        data: {
          type: ButtonType.Github,
          link: ViewModel.githubLink
        },
        href: ViewModel.githubLink,
        "aria-label": gitHubLinkLabel,
        target: "_blank",
        onRenderIcon: onRenderIcon
      });
    }

    if (ViewModel.externalLink) {
      const externalLinkLabel = "View " + ViewModel.appName + " on the web";
      projectCardsData.push({
        data: {
          type: ButtonType.External,
          link: ViewModel.externalLink
        },
        href: ViewModel.externalLink,
        "aria-label": externalLinkLabel,
        target: "_blank",
        onRenderIcon: onRenderIcon
      });
    }

    setProjectCardActions(projectCardsData);

    return () =>
      window.removeEventListener("resize", updateDimensions);
  }, [ViewModel.githubLink, ViewModel.externalLink, ViewModel.downloadLink]);

  const updateDimensions = () => {
    const width = window.innerWidth
    setWindowWidth(width)
  }

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
      images: ViewModel.images,
      awaitingLaunchApproval: ViewModel.awaitingLaunchApproval,
      isPrivate: ViewModel.isPrivate
    };
    setProjectViewModel({ ...ViewModel, ...data });

    const req = await ModifyProject(data, { appName: ViewModel.appName });
    if (req.status !== 200) {
      setShowManualApproveProjectDialogErrorMessage((await req.json()).reason);
    } else {
      setShowManualApproveProjectDialog(false);
      props.onProjectRemove?.call(undefined, ViewModel);
    }
  }

  async function ApproveLaunchSubmission(launchYear: number) {
    const projectData: IModifyProjectsRequestBody = {
      appName: ViewModel.appName,
      description: ViewModel.description,
      needsManualReview: ViewModel.needsManualReview,
      isPrivate: ViewModel.isPrivate,
      heroImage: ViewModel.heroImage,
      images: ViewModel.images,
      awaitingLaunchApproval: false,
    };

    setProjectViewModel({ ...ViewModel, ...projectData });

    const tagUpdateReq = await fetchBackend(`projects/tags?appName=${ViewModel.appName}`, "POST", { tagName: `Launch ${launchYear}` });
    if (tagUpdateReq.status !== 200) {
      setShowLaunchApproveProjectDialogErrorMessage((await tagUpdateReq.json()).reason);
      return;
    }

    const projectUpdateReq = await ModifyProject(projectData, { appName: ViewModel.appName });
    if (projectUpdateReq.status !== 200) {
      setShowLaunchApproveProjectDialogErrorMessage((await projectUpdateReq.json()).reason);
      return;
    }

    await AssignLaunchParticipantRole(ViewModel.collaborators.filter(p => p.isOwner)[0]);
    setShowLaunchApprovalDialog(false);
    props.onProjectRemove?.call(undefined, ViewModel);
  }

  async function AssignLaunchParticipantRole(user: IProjectCollaborator) {
    const roleAssignReq = await AssignUserRole("Launch Participant", user.discordId);
    if (roleAssignReq && roleAssignReq.ok === false) {
      setShowLaunchApproveProjectDialogErrorMessage(`Project was approved, but the user couldn't be assigned the Launch Participant role. (Error: ${(await roleAssignReq.json()).reason})`);
    }
  }

  async function GetOwner() {
    var collaborators = await GetCollaborators();
    return collaborators?.filter(x => x.isOwner)[0];
  }

  async function GetCollaborators() {
    const projectCollaboratorsReq = await fetchBackend(`projects/collaborators?projectId=${ViewModel.id}`, "GET");
    if (projectCollaboratorsReq.status !== 200) {
      setShowLaunchApproveProjectDialogErrorMessage((await projectCollaboratorsReq.json()).reason);
      return;
    }

    var json = await projectCollaboratorsReq.json();
    const collaborators = json as IProjectCollaborator[];

    return collaborators;
  }

  async function GetImages() {
    const req = await fetchBackend(`projects/images?projectId=${ViewModel.id}`, "GET");
    if (req.status !== 200) {
      return;
    }

    var json = await req.json();
    return json as string[];
  }

  async function GetFeatures() {
    const req = await fetchBackend(`projects/features?projectId=${ViewModel.id}`, "GET");
    if (req.status !== 200) {
      return;
    }

    var json = await req.json();
    const features = json as string[];
    return features;
  }

  async function OnLaunchApproval() {
    const owner = await GetOwner();
    if (!owner) {
      console.error("Owner not found");
      return;
    }

    GetDiscordUser(owner.discordId).then(owner => {
      setProjectOwner(owner);
      setShowLaunchApprovalDialog(true);
    });
  }

  async function OnManualApproval() {
    const owner = await GetOwner();
    if (!owner) {
      console.error("Owner not found");
      return;
    }

    GetDiscordUser(owner.discordId)
      .then(owner => {
        setProjectOwner(owner);
        setShowManualApproveProjectDialog(true);
      });
  }

  function onCardKeyDown(ev: React.KeyboardEvent<HTMLDivElement>) {
    if (ev.keyCode === 13) {
      setShowProjectDetailsModal(true)
    }
  }

  return (
    <DocumentCard style={{ width: 275 }} tabIndex={0} onKeyDown={(e) => onCardKeyDown(e)}>

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
                await ApproveLaunchSubmission(2021);
              }} />
            <DefaultButton onClick={() => { setShowLaunchApprovalDialog(false); }} text="Cancel" />
          </Stack>
        </Stack>
      </Dialog>

      <Modal styles={{ root: { maxWidth: "100vw" } }} onDismiss={() => setShowProjectDetailsModal(false)} isOpen={showProjectDetailsModal}>
        <Stack>
          <Stack tokens={{ padding: "7px 10px" }}>
            <Stack horizontal horizontalAlign="space-between" style={{ padding: "0px 0px 2px 0px", marginBottom: "10px" }}>
              <Stack horizontal tokens={{ childrenGap: 10, padding: 5 }}>
                {ViewModel.appIcon ?
                  <Image style={{ height: 40, width: 40 }} src={ViewModel.appIcon} />
                  : <></>}

                <Text variant="xxLarge" style={{ fontWeight: 400 }}>{ViewModel.appName}</Text>

                <Stack horizontal tokens={{ childrenGap: 5, padding: 5 }} style={{ display: (width > 700 ? 'flex' : 'none') }} verticalAlign="center">
                  {props.editable === true ? (<>
                    <PrimaryButton iconProps={{ iconName: "edit", style: { fontSize: 16 } }} style={{ minWidth: 40, padding: 0 }} onClick={() => { setShowEditDialog(true) }} />
                    <PrimaryButton iconProps={{ iconName: "delete", style: { fontSize: 16 } }} style={{ minWidth: 40, padding: 0 }} onClick={() => { setShowDeleteProjectDialog(true) }} />
                  </>) : <></>}

                  {props.modOptions !== undefined && ViewModel.needsManualReview ? (<>
                    <PrimaryButton iconProps={{ iconName: "Ferry", style: { fontSize: 18 } }} style={{ minWidth: 35, padding: 0 }} onClick={OnManualApproval}
                    />
                  </>) : <></>}

                  {props.modOptions !== undefined && ViewModel.awaitingLaunchApproval && !ViewModel.needsManualReview ? (<>
                    <PrimaryButton iconProps={{ iconName: "Rocket", style: { fontSize: 18 } }} style={{ minWidth: 35, padding: 0 }} onClick={OnLaunchApproval} />
                  </>) : <></>}

                  <DocumentCardActions styles={{ root: { padding: 0 } }} actions={projectCardActions} />
                </Stack>
              </Stack>

              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 5 }}>
                {projectOwner ?
                  (<>
                    <Text variant="smallPlus">{projectOwner.username}#{projectOwner.discriminator}</Text>
                  </>) : <>No owner data</>}
                <Link style={{ margin: 10 }} onClick={() => setShowProjectDetailsModal(false)}>
                  <FontIcon style={{ fontSize: 16, color: "black" }} iconName="ChromeClose" />
                </Link>
              </Stack>
            </Stack>

            <Stack horizontal tokens={{ childrenGap: 5, padding: 5 }} style={{ display: (width < 700 ? 'flex' : 'none') }} verticalAlign="center">
              {props.editable === true ? (<>
                <PrimaryButton iconProps={{ iconName: "edit", style: { fontSize: 16 } }} style={{ minWidth: 40, padding: 0 }} onClick={() => { setShowEditDialog(true) }} />
                <PrimaryButton iconProps={{ iconName: "delete", style: { fontSize: 16 } }} style={{ minWidth: 40, padding: 0 }} onClick={() => { setShowDeleteProjectDialog(true) }} />
              </>) : <></>}

              {props.modOptions !== undefined && ViewModel.needsManualReview ? (<>
                <PrimaryButton iconProps={{ iconName: "Ferry", style: { fontSize: 18 } }} style={{ minWidth: 35, padding: 0 }} onClick={OnManualApproval}
                />
              </>) : <></>}

              {props.modOptions !== undefined && ViewModel.awaitingLaunchApproval && !ViewModel.needsManualReview ? (<>
                <PrimaryButton iconProps={{ iconName: "Rocket", style: { fontSize: 18 } }} style={{ minWidth: 35, padding: 0 }} onClick={OnLaunchApproval} />
              </>) : <></>}

              <DocumentCardActions styles={{ root: { padding: 0 } }} actions={projectCardActions} />
            </Stack>

            <Text style={{ maxWidth: 1190 }} variant="medium">{ViewModel.description}</Text>

          </Stack>

          <div style={{ display: ((ViewModel.features.length > 0) ? 'none' : 'flex') }}>
            <Image style={{ borderTop: "2px solid midnightblue", width: "auto" }} width={1200} height={675} src={ViewModel.heroImage} imageFit={ImageFit.contain} />
          </div>

          <Stack style={{ display: ((ViewModel.features.length > 0) ? 'flex' : 'none'), maxWidth: 1200 }} horizontal={(width > 800)}>
            <Image src={ViewModel.heroImage} style={{ maxWidth: 700 }} />

            <Stack style={{ margin: 15, width: '40%' }} verticalAlign="space-between">
              <Stack>
                <Text variant="large">Features</Text>
                <Stack>
                  {(ViewModel.features.map((feature, i) =>
                    <Text key={i} variant="mediumPlus">• {feature}</Text>
                  ))}
                </Stack>
              </Stack>

              <Stack style={{ marginTop: 15 }}>
                <Text variant="large">Developers</Text>
                <Stack horizontal wrap style={{ marginTop: 10 }} tokens={{ childrenGap: 10 }}>

                  {(ViewModel.collaborators.filter(x => x.role == "Developer").map((user, i) =>
                    <Stack>
                      <Text key={i}>{user.name}</Text>
                    </Stack>
                  ))}
                </Stack>
              </Stack>

              <Stack style={{ marginTop: 15, display: (ViewModel.collaborators.filter(x => x.role == "Beta Tester").length > 0 ? 'flex' : 'none') }}>
                <Text variant="large">Beta Testers</Text>
                <Stack horizontal wrap style={{ marginTop: 10 }} tokens={{ childrenGap: 10 }}>

                  {(ViewModel.collaborators.filter(x => x.role == "Beta Tester").map((user, i) =>
                    <Stack>
                      <Text key={i}>{user.name}</Text>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          <Stack style={{ maxWidth: 1200 }}>

            <Stack horizontal wrap style={{ marginTop: 15 }} horizontalAlign="center">
              {(ViewModel.images.map((img, i) =>

                <Image src={img} key={i} style={{ height: (width > 600 ? 600 : 'unset'), width: (width > 600 ? '600' : '100%') }} />

              ))}
            </Stack>

          </Stack>

        </Stack>
      </Modal>

      <PointerOnHover>
        <Image onClick={async () => {
          const owner = await GetOwner();
          if (!owner) {
            console.error("Owner not found");
            return;
          }

          GetDiscordUser(owner.discordId)
            .then(owner => {
              setProjectOwner(owner);
              setShowProjectDetailsModal(true)
            });

          var images = await GetImages();
          var features = await GetFeatures();
          var collaborators = await GetCollaborators();

          setProjectViewModel({ ...ViewModel, features: features ?? [], collaborators: collaborators ?? [], images: images ?? [] });
        }}
          height={150} imageFit={ImageFit.centerCover} src={ViewModel.heroImage} alt={"Preview image for " + ViewModel.appName} />
      </PointerOnHover>

      <DocumentCardDetails>
        <Stack horizontal tokens={{ padding: 5 }} verticalAlign="center">
          {ViewModel.needsManualReview ?
            <TooltipHost content="Waiting for approval" delay={TooltipDelay.zero}>
              <FontIcon style={{ fontSize: 26, padding: "0px 5px" }} iconName="Manufacturing" />
            </TooltipHost>
            : <></>}

          {(ViewModel.awaitingLaunchApproval && props.modOptions) ?
            <TooltipHost content="Awaiting Launch approval" delay={TooltipDelay.zero}>
              <FontIcon style={{ fontSize: 24, padding: "0px 5px" }} iconName="Rocket" />
            </TooltipHost>
            : <></>}

          {ViewModel.tags.map(tag => (
            tag.name.includes("Launch ") ?
              <TooltipHost content={`${tag.name} participant`} delay={TooltipDelay.zero} key={tag.id}>
                <FontIcon style={{ fontSize: 24, padding: "0px 5px" }} iconName="Rocket" />
              </TooltipHost>
              : <></>
          ))}
          <DocumentCardTitle styles={{ root: { padding: "5px 5px", height: "auto", fontWeight: 600 } }} title={ViewModel.appName} />
        </Stack>
        <Stack tokens={{ padding: "0px 10px 10px 10px" }}>
          <Text style={{ overflowY: "auto", height: 60 }}>{ViewModel.description}</Text>
        </Stack>
        <Stack horizontal tokens={{ childrenGap: 5, padding: 5 }} verticalAlign="center">
          {props.editable === true ? (<>
            <PrimaryButton iconProps={{ iconName: "edit", style: { fontSize: 18 } }} style={{ minWidth: 45, padding: 0 }} onClick={() => { setShowEditDialog(true) }} />
            <PrimaryButton iconProps={{ iconName: "delete", style: { fontSize: 18 } }} style={{ minWidth: 45, padding: 0 }} onClick={() => { setShowDeleteProjectDialog(true) }} />
          </>) : <></>}

          {props.modOptions !== undefined && ViewModel.needsManualReview ? (<>
            <PrimaryButton iconProps={{ iconName: "Ferry", style: { fontSize: 20 } }} style={{ minWidth: 35, padding: 0 }} onClick={OnManualApproval}
            />
          </>) : <></>}

          {props.modOptions !== undefined && ViewModel.awaitingLaunchApproval && !ViewModel.needsManualReview ? (<>
            <PrimaryButton iconProps={{ iconName: "Rocket", style: { fontSize: 20 } }} style={{ minWidth: 35, padding: 0 }} onClick={OnLaunchApproval} />
          </>) : <></>}

          <DocumentCardActions styles={{ root: { padding: 0 } }} actions={projectCardActions} />
        </Stack>
      </DocumentCardDetails>
    </DocumentCard>
  )
}
