import React from "react";
import { Stack, Link, Text } from "office-ui-fabric-react";
import { discordLink, githubLink, mediumLink } from "../../common/const";

export const Footer: React.StatelessComponent = () => {
  return (
    <Stack horizontal horizontalAlign="center" style={{padding: 10}}>      
      <Link href={discordLink} target="_blank" style={{padding:10}}>Join Us On Discord</Link>
      <Text style={{padding:10}}>//</Text>
      <Link href={githubLink} target="_blank" style={{padding:10}}>Contribute On Github</Link>
      <Text style={{padding:10}}>//</Text>
      <Link href={mediumLink} target="_blank" style={{padding:10}}>UWP Community Launch</Link>
    </Stack>
  );
};
