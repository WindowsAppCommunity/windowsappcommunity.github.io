import * as React from "react";
import { Text, Stack } from "office-ui-fabric-react";

export const NotFound: React.StatelessComponent = () => {
  return (
    <Stack horizontal horizontalAlign="center">
      <Text variant="large" style={{ padding: 10 }}>
        404 Not Found
      </Text>
    </Stack>
  );
};
