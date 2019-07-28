import React from "react";
import { Text } from "office-ui-fabric-react";

interface HeaderProps {
  a: string;
  b: string;
}

export class Header extends React.Component<HeaderProps> {
  render() {
    return (
      <Text variant="large" style={{padding: 10}}>
        Projects {this.props.a} {this.props.b}
        
      <Text variant="medium" style={{ padding: 10 }}>
      A list of the UWP Community Projects
      </Text>
      </Text>
    );
  }
}
