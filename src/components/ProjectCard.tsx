import { DeleteProject, ModifyProject } from "../common/services/projects";
import { DocumentCard, ImageFit, DocumentCardDetails, DocumentCardTitle, Text, Stack, DocumentCardActions, IButtonProps, PrimaryButton, Dialog, FontIcon, DefaultButton, DialogType, TooltipHost, TooltipDelay, Modal, Image, Link } from "@fluentui/react";
import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EditProjectDetailsForm } from "./forms/EditProjectDetailsForm";
import { IDiscordUser, GetDiscordUser } from "../common/services/discord";
import styled from "styled-components";
import { IProject } from "../interface/IProject";
import { IpfsImage } from "./IpfsImage";
import { IDiscordConnection } from "../interface/IUserConnection";
import { GetUser } from "../common/services/users";

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

  const [showProjectDetailsModal, setShowProjectDetailsModal] = React.useState(false);

  const [showProjectUserManagerDialog, setShowProjectUserManagerDialog] = React.useState(false);

  const [ViewModel, setProjectViewModel] = React.useState<IProject>(props.project);
  const [projectOwner, setProjectOwner] = React.useState<IDiscordUser>();

  React.useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const projectCardsData: IButtonProps[] = [];

    for (var link of ViewModel.links) {

      var buttonType = ButtonType.External;

      if (link.url.includes("github.com")) {
        buttonType = ButtonType.Github;
      }

      if (link.url.includes("microsoft.com")) {
        buttonType = ButtonType.Download;
      }

      projectCardsData.push({
        data: {
          type: buttonType,
          link: link
        },
        href: link.url,
        "aria-label": link.description,
        target: "_blank",
        onRenderIcon: onRenderIcon
      });
    }

    setProjectCardActions(projectCardsData);

    return () =>
      window.removeEventListener("resize", updateDimensions);
  }, [ViewModel.links]);

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
    setProjectViewModel({ ...ViewModel, needsManualReview: false });

    const req = await ModifyProject(ViewModel, { name: ViewModel.name });
    if (req.status !== 200) {
      setShowManualApproveProjectDialogErrorMessage((await req.json()).reason);
    } else {
      setShowManualApproveProjectDialog(false);
      props.onProjectRemove?.call(undefined, ViewModel);
    }
  }

  function GetOwner() {
    return ViewModel.collaborators.filter(x => x.role.name.toLowerCase() == "owner")[0];
  }

  async function OnManualApproval() {
    var owner = GetOwner();
    if (!owner) {
      console.error("Owner not found");
      return;
    }

    var user = await GetUser(owner.user);
    var discordConnection = user?.connections.filter(x => x.connectionName.toLowerCase() == "discord")[0] as IDiscordConnection;
    if (!discordConnection) {
      console.error("Discord connection not found. Count not approve project.");
    }

    GetDiscordUser(discordConnection.discordId)
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

      <Dialog hidden={!showEditDialog} title={`Edit ${ViewModel.name}`}
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
              await DeleteProject({ name: ViewModel.name });
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
          subText: projectOwner ? `${ViewModel.name} belongs to ${projectOwner.username}#${projectOwner.discriminator}` : "Project owner info not available"
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

    {/*   <Modal styles={{ root: { maxWidth: "100vw" } }} onDismiss={() => setShowProjectUserManagerDialog(false)} isOpen={showProjectUserManagerDialog}>
        <Stack style={{ margin: 15 }}>
          <Stack style={{ marginBottom: -20, zIndex: 1 }} horizontalAlign="end">
            <Link onClick={() => setShowProjectUserManagerDialog(false)}>
              <FontIcon style={{ fontSize: 16, color: "black" }} iconName="ChromeClose" />
            </Link>
          </Stack>

          <UserManager project={props.project} />
        </Stack>
      </Modal> */}

      <Modal styles={{ root: { maxWidth: "100vw" } }} onDismiss={() => setShowProjectDetailsModal(false)} isOpen={showProjectDetailsModal}>
        <Stack>
          <Stack tokens={{ padding: "7px 10px" }}>
            <Stack horizontal horizontalAlign="space-between" style={{ padding: "0px 0px 2px 0px", marginBottom: "10px" }}>
              <Stack horizontal tokens={{ childrenGap: 10, padding: 5 }}>
                {ViewModel.icon ?
                  <IpfsImage style={{ height: 40, width: 40 }} cid={ViewModel.icon} />
                  : <></>}

                <Text variant="xxLarge" style={{ fontWeight: 400 }}>{ViewModel.name}</Text>

                <Stack horizontal tokens={{ childrenGap: 5, padding: 5 }} style={{ display: (width > 700 ? 'flex' : 'none') }} verticalAlign="center">
                  {props.editable === true ? (<>
{/*                     <PrimaryButton iconProps={{ iconName: "group", style: { fontSize: 18 } }} style={{ minWidth: 45, padding: 0 }} onClick={() => { setShowProjectUserManagerDialog(true) }} />
 */}                    <PrimaryButton iconProps={{ iconName: "edit", style: { fontSize: 16 } }} style={{ minWidth: 40, padding: 0 }} onClick={() => { setShowEditDialog(true) }} />
                    <PrimaryButton iconProps={{ iconName: "delete", style: { fontSize: 16 } }} style={{ minWidth: 40, padding: 0 }} onClick={() => { setShowDeleteProjectDialog(true) }} />
                  </>) : <></>}

                  {props.modOptions !== undefined && ViewModel.needsManualReview ? (<>
                    <PrimaryButton iconProps={{ iconName: "Ferry", style: { fontSize: 18 } }} style={{ minWidth: 35, padding: 0 }} onClick={OnManualApproval}
                    />
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
{/*                 <PrimaryButton iconProps={{ iconName: "group", style: { fontSize: 18 } }} style={{ minWidth: 45, padding: 0 }} onClick={() => { setShowProjectUserManagerDialog(true) }} />
 */}                <PrimaryButton iconProps={{ iconName: "edit", style: { fontSize: 16 } }} style={{ minWidth: 40, padding: 0 }} onClick={() => { setShowEditDialog(true) }} />
                <PrimaryButton iconProps={{ iconName: "delete", style: { fontSize: 16 } }} style={{ minWidth: 40, padding: 0 }} onClick={() => { setShowDeleteProjectDialog(true) }} />
              </>) : <></>}

              {props.modOptions !== undefined && ViewModel.needsManualReview ? (<>
                <PrimaryButton iconProps={{ iconName: "Ferry", style: { fontSize: 18 } }} style={{ minWidth: 35, padding: 0 }} onClick={OnManualApproval}
                />
              </>) : <></>}

              <DocumentCardActions styles={{ root: { padding: 0 } }} actions={projectCardActions} />
            </Stack>

            <Text style={{ maxWidth: 1190 }} variant="medium">{ViewModel.description}</Text>

          </Stack>

          <div style={{ display: ((ViewModel.features.length > 0) ? 'none' : 'flex') }}>
            <IpfsImage style={{ borderTop: "2px solid midnightblue", width: "auto" }} width={1200} height={675} cid={ViewModel.heroImage} imageFit={ImageFit.contain} />
          </div>

          <Stack style={{ display: ((ViewModel.features.length > 0) ? 'flex' : 'none'), maxWidth: 1200 }} horizontal={(width > 800)}>
            <IpfsImage cid={ViewModel.heroImage} style={{ maxWidth: 700 }} />

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

                  {(ViewModel.collaborators.filter(x => x.role.name.toLowerCase() == "developer").map((user, i) =>
                    <Stack key={i}>
                      <Text key={i}>{user}</Text>
                    </Stack>
                  ))}
                </Stack>
              </Stack>

              <Stack style={{ marginTop: 15, display: (ViewModel.collaborators.filter(x => x.role.name.toLowerCase() == "beta tester").length > 0 ? 'flex' : 'none') }}>
                <Text variant="large">Beta Testers</Text>
                <Stack horizontal wrap style={{ marginTop: 10 }} tokens={{ childrenGap: 10 }}>

                  {(ViewModel.collaborators.filter(x => x.role.name.toLowerCase() == "beta tester").map((user, i) =>
                    <Stack key={i}>
                      <Text key={i}>{user.user}</Text>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          <Stack style={{ maxWidth: 1200 }}>

            <Stack horizontal wrap style={{ marginTop: 15 }} horizontalAlign="center">
              {(ViewModel.images.map((img, i) =>
                <IpfsImage cid={img} key={i} style={{ height: (width > 600 ? 600 : 'unset'), width: (width > 600 ? '600' : '100%') }} />
              ))}
            </Stack>

          </Stack>

        </Stack>
      </Modal>

      <PointerOnHover>
        <IpfsImage onClick={async () => {
          const owner = await GetOwner();
          if (!owner) {
            console.error("Owner not found");
            return;
          }

          var user = await GetUser(owner.user);
          var discordConnection = user?.connections.filter(x => x.connectionName.toLowerCase() == "discord")[0] as IDiscordConnection;
          if (!discordConnection) {
            console.error("Discord connection not found. Unable to display user information.");
          }

          GetDiscordUser(discordConnection.discordId)
            .then(owner => {
              setProjectOwner(owner);
              setShowProjectDetailsModal(true)
            });
        }}
          height={150} imageFit={ImageFit.centerCover} cid={ViewModel.heroImage} alt={"Preview image for " + ViewModel.name} />
      </PointerOnHover>

      <DocumentCardDetails>
        <Stack horizontal tokens={{ padding: 5 }} verticalAlign="center">
          {ViewModel.icon ?
            <IpfsImage style={{ height: 30, width: 30, marginRight: 5 }} cid={ViewModel.icon} />
            : <></>}

          {ViewModel.needsManualReview ?
            <TooltipHost content="Waiting for approval" delay={TooltipDelay.zero}>
              <FontIcon style={{ fontSize: 26, padding: "0px 5px" }} iconName="Manufacturing" />
            </TooltipHost>
            : <></>}

          <DocumentCardTitle styles={{ root: { padding: "5px 5px", height: "auto", fontWeight: 600 } }} title={ViewModel.name} />
        </Stack>
        <Stack tokens={{ padding: "0px 10px 10px 10px" }}>
          <Text style={{ overflowY: "auto", height: 60 }}>{ViewModel.description}</Text>
        </Stack>
        <Stack horizontal tokens={{ childrenGap: 5, padding: 5 }} verticalAlign="center">
          {props.editable === true ? (<>
{/*             <PrimaryButton iconProps={{ iconName: "group", style: { fontSize: 18 } }} style={{ minWidth: 45, padding: 0 }} onClick={() => { setShowProjectUserManagerDialog(true) }} />
 */}            <PrimaryButton iconProps={{ iconName: "edit", style: { fontSize: 18 } }} style={{ minWidth: 45, padding: 0 }} onClick={() => { setShowEditDialog(true) }} />
            <PrimaryButton iconProps={{ iconName: "delete", style: { fontSize: 18 } }} style={{ minWidth: 45, padding: 0 }} onClick={() => { setShowDeleteProjectDialog(true) }} />
          </>) : <></>}

          {props.modOptions !== undefined && ViewModel.needsManualReview ? (<>
            <PrimaryButton iconProps={{ iconName: "Ferry", style: { fontSize: 20 } }} style={{ minWidth: 35, padding: 0 }} onClick={OnManualApproval}
            />
          </>) : <></>}

          <DocumentCardActions styles={{ root: { padding: 0 } }} actions={projectCardActions} />
        </Stack>
      </DocumentCardDetails>
    </DocumentCard>
  )
}
