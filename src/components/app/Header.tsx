import * as React from "react";
import { Stack, Link } from "office-ui-fabric-react";
import { Image } from "office-ui-fabric-react/lib/Image";
import { discordLogo, githubLogo, mediumLogo, uwpCommunityLogo, discordLink, githubLink, mediumLink } from "../../common/const";

const itemStyles: React.CSSProperties = {
  display: 'flex'
};

export const Header: React.StatelessComponent = () => {
  return (
    <Stack>

      <Stack horizontal horizontalAlign="center">
        <Stack horizontal horizontalAlign="space-between" style={{ width: "80%" }} verticalAlign="end">
          <span style={itemStyles}>
            <Link href="/"><Image src={uwpCommunityLogo} /></Link>
          </span>
          <span style={itemStyles}></span>
          <span style={itemStyles}>
            <Link href={discordLink} target="_blank">
              <Image src={discordLogo} />
            </Link>
            <Link href={githubLink} target="_blank">
              <Image src={githubLogo} style={{ marginLeft: 10 }} />
            </Link>
            <Link href={mediumLink} target="_blank">
              <Image src={mediumLogo} style={{ marginLeft: 10 }} />
            </Link>
          </span>

        </Stack>
      </Stack>
      <header style={{ fontFamily: "Segoe UI, Sans-Serif", fontWeight: "lighter", fontSize: "24px" }}>The unofficial UWP Community Discord Server </header>
    </Stack>
  );
};
