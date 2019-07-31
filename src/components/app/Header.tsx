import * as React from "react";
import { Text, Stack, Link } from "office-ui-fabric-react";
import { Image } from "office-ui-fabric-react/lib/Image";
import { discordLogo, githubLogo, mediumLogo, uwpCommunityLogo, discordLink, githubLink, mediumLink } from "../../common/const";

export const Header: React.StatelessComponent = () => {
  return (
    <Stack horizontal horizontalAlign="center">
      <Link href="/"><Image src={uwpCommunityLogo} height={50} /></Link>
      <Text variant="xxLarge" style={{ padding: 10 }}>UWP Community //</Text>
      <Link href={discordLink} target="_blank"><Image src={discordLogo} height={50} /></Link>
      <Link href={githubLink} target="_blank"><Image src={githubLogo} height={50} /></Link>
      <Link href={mediumLink} target="_blank"><Image src={mediumLogo} height={50} /></Link>
    </Stack>
  );
};
