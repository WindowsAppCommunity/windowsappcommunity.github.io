import * as React from "react";
import { Text, Stack } from "office-ui-fabric-react";

export const About: React.StatelessComponent = () => {
  return (
    <Stack horizontal horizontalAlign="center">
      <Text variant="large" style={{ padding: 10 }}>
        About
      </Text>
    </Stack>
  );
};
