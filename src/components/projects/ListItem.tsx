import React from "react";
import { Project } from "../../common/interfaces";
import {
  DocumentCard,
  DocumentCardTitle,
  DocumentCardDetails,
  DocumentCardImage,
  IDocumentCardStyles
} from "office-ui-fabric-react/lib/DocumentCard";
import { Image, ImageFit } from "office-ui-fabric-react/lib/Image";
import { getSreenshotUrl, getStoreUrl, getGitHubUrl, githubIcon, msstoreIcon, getDiscordUrl, discordIcon } from "../../common/const";
import { Stack, Link, IStackItemStyles, IStackTokens } from "office-ui-fabric-react";

interface ListItemProps {
  project: Project;
}


const stackItemStyles: IStackItemStyles = {
  root: {
    padding: 5
  }
};

const cardStyles: IDocumentCardStyles = {
  root: {
    display: "inline-block",
    marginRight: 10,
    marginBottom: 10,
    width: 320
  }
};

const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 5,
  padding: 10
};


function Github(github: string) {
  if (github) {
    return (
      <Stack.Item align="auto" styles={stackItemStyles}>
        <Link href={getGitHubUrl(github)} target="_blank">
          <Image src={githubIcon} />
        </Link>
      </Stack.Item>
    );
  } else {
    return ("");
  }
}

function Store(store: string) {
  if (store) {
    return (
      <Stack.Item align="auto" styles={stackItemStyles}>
        <Link href={getStoreUrl(store)} target="_blank">
          <Image src={msstoreIcon} />
        </Link>
      </Stack.Item>
    );
  } else {
    return ("");
  }
}

function Discord(discord: string) {
  if (discord) {
    return (
      <Stack.Item align="auto" styles={stackItemStyles}>
        <Link href={getDiscordUrl(discord)} target="_blank">
          <Image src={discordIcon} />
        </Link>
      </Stack.Item>
    );
  } else {
    return ("");
  }
}


export class ListItem extends React.Component<ListItemProps> {
  render() {
    return (
      <DocumentCard styles={cardStyles}>
        <DocumentCardImage
          height={150}
          imageFit={ImageFit.cover}
          imageSrc={getSreenshotUrl(this.props.project.id)}
        />
        <DocumentCardDetails>
          <DocumentCardTitle title={this.props.project.title} shouldTruncate />
          <DocumentCardTitle title={this.props.project.description} showAsSecondaryTitle />

          <Stack horizontal disableShrink tokens={itemAlignmentsStackTokens}>
            {Github(this.props.project.github)}

            {Store(this.props.project.store)}

            {/* {Discord(this.props.project.discord)} */}
          </Stack>
        </DocumentCardDetails>
      </DocumentCard>
    );
  }
}
