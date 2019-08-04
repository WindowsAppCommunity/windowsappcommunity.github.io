import React from "react";
import { Text, Stack } from "office-ui-fabric-react";
import { Depths } from '@uifabric/fluent-theme/lib/fluent/FluentDepths';

interface HeaderProps {
  title: string;
  subTitle: string;
}

const stackStyle = {
  boxShadow: Depths.depth8, 
  width: "80%",
  marginTop: 10, 
  marginBottom: 10,
  padding:10
}

export class SubHeader extends React.Component<HeaderProps> {
  render() {
    return (
      <Stack horizontal horizontalAlign="start" style={stackStyle}>
        <Text variant="medium">
          {this.props.title}
        </Text>
        <Text variant="medium" style={{marginLeft:5}}>
          {this.props.subTitle}
        </Text>
      </Stack>
    );
  }
}
