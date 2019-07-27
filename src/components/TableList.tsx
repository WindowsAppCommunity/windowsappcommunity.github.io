import React from "react";
import { getGitHubUrl, getSreenshotUrl, getStoreUrl, githubIcon, msstoreIcon } from "../common/const";
import { ProjectList } from "../common/interfaces";
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
import { render } from "react-dom";

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

function Github(github:string) {
  if (github) {
    return (
      <a href={getGitHubUrl(github)} target="_blank">
      <img src={githubIcon}/>
    </a>
    );
  }else{
    return ("");
  }
}

function Store(store:string) {
  if (store) {
    return (
      <a href={getStoreUrl(store)} target="_blank">
      <img src={msstoreIcon}/>
    </a>
    );
  }else{
    return ("");
  }
}

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

        {Github(item.github)}
        
        {Store(item.store)}
      </DocumentCardDetails>
    </DocumentCard>
  ));

  return <div>{items}</div>;
};
