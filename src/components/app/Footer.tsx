import React from "react";
import { Stack, Link } from "office-ui-fabric-react";
import { Image } from "office-ui-fabric-react/lib/Image";
import { Links } from "../../common/const";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";

export const Footer: React.StatelessComponent = () => {
  return (
    <Stack horizontalAlign="center" style={{marginTop:30}}>
      <Stack horizontal>
        <Link href="/"></Link>
      </Stack>
      <Stack horizontal style={{marginTop:10}}>
        <Link href={Links.discordServerInvite} target="_blank" style={{boxShadow: Depths.depth8}}>

          </Link>
        <Link href={Links.githubOrganization} target="_blank" style={{boxShadow: Depths.depth8, marginLeft:10}}>

          </Link>
        <Link href={Links.launch2019Medium} target="_blank" style={{boxShadow: Depths.depth8, marginLeft:10}}>

          </Link>
      </Stack>
    </Stack>
  );
};
