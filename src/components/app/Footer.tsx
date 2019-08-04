import React from "react";
import { Stack, Link } from "office-ui-fabric-react";
import { Image } from "office-ui-fabric-react/lib/Image";
import { discordLink, githubLink, mediumLink, uwpCommunityLogoBottom, discordBottom, githubBottom, mediumBottom } from "../../common/const";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";

export const Footer: React.StatelessComponent = () => {
  return (
    <Stack horizontalAlign="center" style={{marginTop:30}}>
      <Stack horizontal>
        <Link href="/"><Image src={uwpCommunityLogoBottom} /></Link>
      </Stack>
      <Stack horizontal style={{marginTop:10}}>
        <Link href={discordLink} target="_blank" style={{boxShadow: Depths.depth8}}>
          <Image src={discordBottom} />
          </Link>
        <Link href={githubLink} target="_blank" style={{boxShadow: Depths.depth8, marginLeft:10}}>
          <Image src={githubBottom} />
          </Link>
        <Link href={mediumLink} target="_blank" style={{boxShadow: Depths.depth8, marginLeft:10}}>
          <Image src={mediumBottom} />
          </Link>
      </Stack>
    </Stack>
  );
};
