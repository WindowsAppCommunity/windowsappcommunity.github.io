import React, { CSSProperties } from "react";
import { Stack, Link } from "office-ui-fabric-react";
import { discordLink, githubLink, mediumLink } from "../../common/const";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FaIconStyle: CSSProperties = {
  color: "black",
  height: "65px",
  width: "65px"
};

const LinkCardStyle: CSSProperties = {
  boxShadow: Depths.depth8,
  margin: "5px",
  padding: "7px",
  maxWidth: "400px"
};

export const Home: React.StatelessComponent = () => {
  return (
    <Stack wrap horizontal horizontalAlign="center" padding="10px">

      <Stack style={LinkCardStyle} horizontal verticalAlign="center" horizontalAlign="center" gap="7px">
        <Stack gap="10px" style={{ margin: "10px" }}>
          <div>Our server is home to a variety of apps, developers and enthusiasts</div>
          <Link href={discordLink} target="_blank">
            <div>Join our discord server</div>
          </Link>
        </Stack>
        <FontAwesomeIcon style={FaIconStyle} icon={["fab", "discord"]} />
      </Stack>


      <Stack style={LinkCardStyle} horizontal verticalAlign="center" horizontalAlign="center" gap="7px">
        <FontAwesomeIcon style={FaIconStyle} icon={["fab", "github"]} />
        <Stack gap="10px" style={{ margin: "10px" }}>
          <div>Many of our projects are open source, so others can learn or build with them</div>
          <Link href={githubLink} target="_blank">
            <div>See our open source projects</div>
          </Link>
        </Stack>
      </Stack>


      <Stack style={LinkCardStyle} horizontal verticalAlign="center" horizontalAlign="center" gap="7px">
        <Stack gap="10px" style={{ margin: "10px" }}>
          <div>As a community of talented developers, each year we Launch our projects together in an annnual event known as <code>Launch</code></div>
          <Link href={mediumLink} target="_blank">
            <div>Read about Launch 2019</div>
          </Link>
        </Stack>
        <FontAwesomeIcon style={FaIconStyle} icon={["fab", "medium"]} />
      </Stack>

    </Stack>

  );
};
