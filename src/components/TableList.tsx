import React from "react";
import { ProjectList, getGitHubUrl, getSreenshotUrl, getStoreUrl } from "../common/ProjectList";
// import { TableListItem } from "./TableListItem";
import {
  DocumentCard,
  DocumentCardTitle,
  DocumentCardDetails,
  DocumentCardImage,
  IDocumentCardStyles,
  DocumentCardStatus
} from "office-ui-fabric-react/lib/DocumentCard";
import { ImageFit } from "office-ui-fabric-react/lib/Image";

interface TableListProps {
  projects: ProjectList;
}

const cardStyles: IDocumentCardStyles = {
  root: {
    display: "inline-block",
    marginRight: 20,
    marginBottom: 20,
    width: 320
  }
};

export const TableList = (props: TableListProps) => {
  // return props.projects.projects.map((item, key) => (
  //   <div>
  //     <TableListItem project={item} />
  //   </div>
  // ));

  const items = props.projects.projects.map((item, key) => (

    <DocumentCard styles={cardStyles}>
      <DocumentCardImage
        height={150}
        imageFit={ImageFit.cover}
        imageSrc={getSreenshotUrl(item.id)}
      />
      <DocumentCardDetails>
        <DocumentCardTitle title={item.title} shouldTruncate/>
        <DocumentCardTitle title={item.description} showAsSecondaryTitle />
        <a href={getGitHubUrl(item.github)} target="_blank">
          <DocumentCardStatus statusIcon="attach" status={item.github} />
        </a>
        <a href={getStoreUrl(item.store)} target="_blank">
          <DocumentCardStatus statusIcon="attach" status={item.store} />
        </a>     
      </DocumentCardDetails>
    </DocumentCard>
  ));

  return <div>{items}</div>;
};
