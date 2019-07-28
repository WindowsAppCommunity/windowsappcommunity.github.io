import * as React from "react";
import { Text, Stack } from "office-ui-fabric-react";

export const Header: React.StatelessComponent = () => {
  return (
    <Stack horizontalAlign="center">
      <Text variant="xxLarge" style={{ padding: 10 }}>
        UWP Community
      </Text>
    </Stack>
  );
};
