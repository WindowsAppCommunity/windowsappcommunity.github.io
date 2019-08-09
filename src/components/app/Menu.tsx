import * as React from 'react';
import { Pivot, PivotItem, PivotLinkFormat, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import { Stack, Link } from "office-ui-fabric-react";

export class Menu extends React.Component<any, any> {
  public render(): JSX.Element {
    return (
      <Pivot linkSize={PivotLinkSize.large} onLinkClick={this.onLinkClick}>
        <PivotItem headerText="Home" itemKey="#" />
        <PivotItem headerText="Projects" itemKey="#/projects" />
      </Pivot>
    );
  }

  public onLinkClick(item?: PivotItem, ev?: React.MouseEvent<HTMLElement>): void {
    if (item) {
      console.log(item.props.itemKey);
      window.open(item.props.itemKey, '_self');
    }
  }
}