import * as React from "react";
import { Text, Stack } from "office-ui-fabric-react";
import { Image } from "office-ui-fabric-react/lib/Image";
import { logoIcon } from "../common/const";

export const Header: React.StatelessComponent = () => {
  return (
    <Stack horizontal horizontalAlign="center">
      <Image src={logoIcon} height={50} />
      <Text variant="xxLarge" style={{ padding: 10 }}>
        UWP Community
      </Text>
    </Stack>
  );
};
