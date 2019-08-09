import * as React from 'react';
import { Pivot, PivotItem, PivotLinkFormat, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';

export class Menu extends React.Component<any, any> {
  public render(): JSX.Element {
    return (
      <Pivot linkSize={PivotLinkSize.large} onLinkClick={this.onLinkClick} style={{ margin: "10px" }}>
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