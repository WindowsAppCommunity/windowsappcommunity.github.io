import React from "react";
import { IProject } from "../common/interfaces";
import {
  DocumentCard,
  DocumentCardTitle,
  DocumentCardDetails,
  DocumentCardImage,
  IDocumentCardStyles
} from "office-ui-fabric-react/lib/DocumentCard";
import { ImageFit } from "office-ui-fabric-react/lib/Image";
import { Images } from "../common/const";
import Helpers from "../common/helpers";

import { Stack, Link, IStackTokens } from "office-ui-fabric-react";
import { Depths } from '@uifabric/fluent-theme/lib/fluent/FluentDepths';
import SVG from 'react-inlinesvg';


interface ListItemProps {
  project: IProject;
}

export const getThumbUrl = (id: string) => {
  return `/assets/thumbs/${id}.png`;
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


export class ProjectCard extends React.Component<ListItemProps> {
  constructor(props: ListItemProps) {
    super(props);
    this.GetBadge.bind(this);
    this.GetDiscordBadge.bind(this);
    this.GetStoreBadge.bind(this);
    this.GetGithubBadge.bind(this);
  }

  private GetBadge(badge:string, url: string) {
    return (
      <Stack.Item>
        <Link href={url} target="_blank">
          <SVG src={badge} />
        </Link>
      </Stack.Item>
    );
  };

  private GetDiscordBadge(discord?: string) {
    if (!discord) return "";
    return this.GetBadge(Images.Badges.discord, Helpers.getDiscordUrl(discord));
  };

  private GetStoreBadge(store: string) {
    if (!store) return "";
    return this.GetBadge(Images.Badges.msstore, Helpers.getStoreUrl(store));
  };

  private GetGithubBadge(github: string) {
    if (!github) return "";
    return this.GetBadge(Images.Badges.github, Helpers.getGithubUrl(github));
  };

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

          <Stack horizontal horizontalAlign="end" disableShrink tokens={itemAlignmentsStackTokens} style={{ marginRight: 10, marginBottom: 10 }}>
            {this.GetGithubBadge(this.props.project.github)}

            {this.GetStoreBadge(this.props.project.store)}

            {this.GetDiscordBadge(this.props.project.discord)}
          </Stack>
        </DocumentCardDetails>
      </DocumentCard>
    );
  }
}
