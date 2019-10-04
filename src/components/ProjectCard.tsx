import { IProject } from "../common/services/projects";
import { DocumentCard, DocumentCardImage, ImageFit, DocumentCardDetails, DocumentCardTitle, Text, Stack, DocumentCardActions, IButtonProps, PrimaryButton } from "office-ui-fabric-react";
import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  onEditButtonClicked?: Function;
}

export const ProjectCard = (props: IProjectCard) => {
  const [projectCardActions, setProjectCardActions] = React.useState<IButtonProps[]>([]);

  React.useEffect(() => {
    const projectCardsData: IButtonProps[] = [];

    if (props.project.downloadLink) {
      projectCardsData.push({
        data: {
          type: ButtonType.Download,
          link: props.project.downloadLink
        },
        href: props.project.downloadLink,
        onRenderIcon: onRenderIcon
      });
    }

    if (props.project.githubLink) {
      projectCardsData.push({
        data: {
          type: ButtonType.Github,
          link: props.project.githubLink
        },
        href: props.project.githubLink,
        onRenderIcon: onRenderIcon
      });
    }

    if (props.project.externalLink) {
      projectCardsData.push({
        data: {
          type: ButtonType.External,
          link: props.project.externalLink
        },
        href: props.project.externalLink,
        onRenderIcon: onRenderIcon
      });
    }

    setProjectCardActions(projectCardsData);

  }, [props.project.githubLink, props.project.externalLink, props.project.downloadLink]);

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
      <DocumentCardImage height={150} imageFit={ImageFit.centerCover} imageSrc={props.project.heroImage} />
      <DocumentCardDetails>
        <DocumentCardTitle styles={{ root: { padding: 5, height: "auto" } }} title={props.project.appName} />
        <Stack tokens={{ padding: 10 }}>
          <Text>{props.project.description}</Text>
        </Stack>
        <Stack horizontal tokens={{ childrenGap: 5, padding: 10 }} verticalAlign="center">
          {props.onEditButtonClicked !== undefined ? <PrimaryButton onClick={() => { if (props.onEditButtonClicked) props.onEditButtonClicked() }}>Edit</PrimaryButton> : <></>}

          <DocumentCardActions actions={projectCardActions} />
        </Stack>
      </DocumentCardDetails>
    </DocumentCard>
  )
}