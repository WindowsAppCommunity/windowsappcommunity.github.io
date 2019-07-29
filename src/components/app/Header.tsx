import * as React from "react";
import { Text, Stack, Link } from "office-ui-fabric-react";
import { Image } from "office-ui-fabric-react/lib/Image";
import { discordLogo, githubLogo, mediumLogo, uwpCommunityLogo } from "../../common/const";

export const Header: React.StatelessComponent = () => {
  return (
    <Stack horizontal horizontalAlign="center">
      <Link href="/"><Image src={uwpCommunityLogo} height={50} /></Link>
      <Text variant="xxLarge" style={{ padding: 10 }}>UWP Community //</Text>
      <Link href="https://discord.gg/eBHZSKG" target="_blank"><Image src={discordLogo} height={50} /></Link>
      <Link href="https://github.com/emiliano84/UwpCommunityProjects" target="_blank"><Image src={githubLogo} height={50} /></Link>
      <Link href="https://medium.com/@Arlodottxt/launch-2019-7efd37cc0877" target="_blank"><Image src={mediumLogo} height={50} /></Link>
    </Stack>
  );
};
