import React from "react";
import { ProjectList } from "../common/ProjectList";
import { TableListItem } from "./TableListItem";
import {
  DocumentCard,
  DocumentCardTitle,
  DocumentCardDetails,
  DocumentCardImage,
  IDocumentCardStyles
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
    <DocumentCard styles={cardStyles} onClickHref="http://bing.com">
      <DocumentCardImage
        height={150}
        imageFit={ImageFit.cover}
        imageSrc={item.img}
      />
      <DocumentCardDetails>
        <DocumentCardTitle title={item.label} shouldTruncate />
      </DocumentCardDetails>
    </DocumentCard>
  ));

  return <div>{items}</div>;
};
