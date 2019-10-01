import { IProject } from "../common/services/projects";
import { DocumentCard, DocumentCardImage, ImageFit, DocumentCardDetails, DocumentCardTitle, Text, Stack, DocumentCardActions, FontIcon, IButtonProps, IRenderFunction } from "office-ui-fabric-react";
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
    <DocumentCard>
      <DocumentCardImage height={150} imageFit={ImageFit.centerCover} imageSrc={props.project.heroImage} />
      <DocumentCardDetails>
        <DocumentCardTitle title={props.project.appName} shouldTruncate />
        <Stack tokens={{ padding: 15 }}>
          <Text>{props.project.description}</Text>
        </Stack>
        <DocumentCardActions actions={[
          {
            data: {
              type: ButtonType.Github,
              link: props.project.githubLink
            },
            href: props.project.githubLink,
            onRenderIcon: onRenderIcon
          },
          {
            data: {
              type: ButtonType.Download,
              link: props.project.downloadLink
            },
            href: props.project.downloadLink,
            onRenderIcon: onRenderIcon
          },
          {
            data: {
              type: ButtonType.External,
              link: props.project.externalLink
            },
            href: props.project.externalLink,
            onRenderIcon: onRenderIcon
          }
        ]} />
      </DocumentCardDetails>
    </DocumentCard>
  )
}