import React from "react";
import { Stack, Link, Text } from "office-ui-fabric-react";

export const Footer: React.StatelessComponent = () => {
  return (
    <Stack horizontal horizontalAlign="center" style={{padding: 10}}>      
      <Link href="https://discord.gg/eBHZSKG" target="_blank" style={{padding:10}}>Join Us On Discord</Link>
      <Text style={{padding:10}}>//</Text>
      <Link href="https://github.com/emiliano84/UwpCommunityProjects" target="_blank" style={{padding:10}}>Contribute On Github</Link>
      <Text style={{padding:10}}>//</Text>
      <Link href="https://medium.com/@Arlodottxt/launch-2019-7efd37cc0877" target="_blank" style={{padding:10}}>UWP Community Launch</Link>
    </Stack>
  );
};
