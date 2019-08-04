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
import { getStoreUrl, getGitHubUrl, githubBadge, msstoreBadge, getDiscordUrl, discordBadge, getThumbUrl } from "../../common/const";
import { Stack, Link, IStackTokens } from "office-ui-fabric-react";
import { Depths } from '@uifabric/fluent-theme/lib/fluent/FluentDepths';

interface ListItemProps {
  project: Project;
}


const cardStyles: IDocumentCardStyles = {
  root: {
    display: "inline-block",
    marginRight: 10,
    marginBottom: 10,
    width: 320,
    boxShadow: Depths.depth8
  }
};

const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 5
};


function Github(github: string) {
  if (github) {
    return (
      <Stack.Item>
        <Link href={getGitHubUrl(github)} target="_blank">
          <Image src={githubBadge} />
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
      <Stack.Item>
        <Link href={getStoreUrl(store)} target="_blank">
          <Image src={msstoreBadge} />
        </Link>
      </Stack.Item>
    );
  } else {
    return ("");
  }
}

function Discord(discord?: string) {
  if (discord) {
    return (
      <Stack.Item>
        <Link href={getDiscordUrl(discord)} target="_blank">
          <Image src={discordBadge} />
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
          imageSrc={getThumbUrl(this.props.project.id)}
        />
        <DocumentCardDetails>
          <DocumentCardTitle title={this.props.project.title} shouldTruncate />
          <DocumentCardTitle title={this.props.project.description} showAsSecondaryTitle />

          <Stack horizontal horizontalAlign="end" disableShrink tokens={itemAlignmentsStackTokens} style={{marginRight: 10, marginBottom:10}}>
            {Github(this.props.project.github)}

            {Store(this.props.project.store)}

            {Discord(this.props.project.discord)}
          </Stack>
        </DocumentCardDetails>
      </DocumentCard>
    );
  }
}
