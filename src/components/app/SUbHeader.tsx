import React from "react";
import { Text, Stack } from "office-ui-fabric-react";

interface HeaderProps {
  title: string;
  subTitle: string;
}

export class SubHeader extends React.Component<HeaderProps> {
  render() {
    return (
      <Stack horizontal horizontalAlign="center">
        <Text variant="large" style={{ padding: 10 }}>
          {this.props.title}
        </Text>
        <Text variant="medium" style={{ padding: 10 }}>
          {this.props.subTitle}
        </Text>
      </Stack>
    );
  }
}
