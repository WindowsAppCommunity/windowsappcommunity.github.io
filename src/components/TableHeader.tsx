import React from "react";
import { Text } from "office-ui-fabric-react";

interface TableHeaderProps {
  a: string;
  b: string;
}

export class TableHeader extends React.Component<TableHeaderProps> {
  render() {
    return (
      <Text variant="xxLarge" style={{padding: 10}}>
        UWP Community Projects {this.props.a} {this.props.b}
      </Text>
    );
  }
}
