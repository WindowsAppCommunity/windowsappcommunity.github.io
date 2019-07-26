import React from "react";
import { Project } from "../common/ProjectList";
import {
  DocumentCard,
  DocumentCardTitle,
  DocumentCardDetails,
  DocumentCardImage,
  IDocumentCardStyles
} from "office-ui-fabric-react/lib/DocumentCard";
import { ImageFit } from "office-ui-fabric-react/lib/Image";

interface TableListItemProps {
  project: Project;
}

const cardStyles: IDocumentCardStyles = {
  root: {
    display: "inline-block",
    marginRight: 20,
    marginBottom: 20,
    width: 320
  }
};

export class TableListItem extends React.Component<TableListItemProps> {
  render() {
    return (
      <DocumentCard styles={cardStyles}>
        <DocumentCardImage
          height={150}
          imageFit={ImageFit.cover}
          imageSrc={"/screenshots/"+this.props.project.id+".png"}
        />
        <DocumentCardDetails>
          <DocumentCardTitle title={this.props.project.title} shouldTruncate />
        </DocumentCardDetails>
      </DocumentCard>
    );
  }
}
