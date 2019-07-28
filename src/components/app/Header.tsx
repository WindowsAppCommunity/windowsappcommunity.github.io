import * as React from "react";
import { Text, Stack, Link } from "office-ui-fabric-react";
import { Image } from "office-ui-fabric-react/lib/Image";
import { logoIcon } from "../../common/const";

export const Header: React.StatelessComponent = () => {
  return (
    <Stack>
      <Stack horizontal horizontalAlign="center">
        <Image src={logoIcon} height={50} />
        <Text variant="xxLarge" style={{ padding: 10 }}>
          UWP Community
      </Text></Stack>
      <Stack horizontalAlign="center">
        <Link href="https://discord.gg/eBHZSKG" target="_blank">Join us on Discord</Link>
        <Link href="https://medium.com/@Arlodottxt/launch-2019-7efd37cc0877" target="_blank">Read the announcement</Link>
      </Stack>
    </Stack>
  );
};
