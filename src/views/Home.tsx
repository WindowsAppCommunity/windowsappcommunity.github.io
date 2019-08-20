import React, { CSSProperties } from "react";
import { Stack, Text, PrimaryButton } from "office-ui-fabric-react";
import { Links, Images } from "../common/const";
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HoverBox from '../components/HoverBox';
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";

const FaIconStyle: CSSProperties = {
  color: "black",
  height: "65px",
  width: "65px"
};

const LinkCard = styled.section`
    font-family: Segoe UI, sans-serif;
    padding: 7px;
    max-width: 400px;
`;

let Link = styled.a`
    color: blue;
    width: fit-content;
    text-decoration: none;
    :hover {
      text-decoration: underline;
    };
`;

let Img = styled.img`
    max-width: 100%;
    max-height: 100%;
`;

export const Home: React.StatelessComponent = () => {
  return (
    <Stack wrap horizontal horizontalAlign="space-around" tokens={{ childrenGap: 25 }}>
      <Stack wrap horizontal verticalAlign="center" horizontalAlign="space-between" style={{ boxShadow: Depths.depth16 }}>
        <Stack style={{ margin: "15px" }}>
          <Text variant="xLargePlus">Launch 2020 signup coming soon</Text>
          <Text variant="mediumPlus">Check back later</Text>
          <PrimaryButton style={{ marginTop: "15px" }} text="Submit your app" disabled />
        </Stack>
        <Img src={Images.launchHeroImage} />
      </Stack>

      <Stack wrap horizontal horizontalAlign="space-around" tokens={{ childrenGap: 15 }}>
        <HoverBox>
          <LinkCard>
            <Stack>
              <Img src={Images.discordChatExample} />

              <Stack horizontal verticalAlign="center" horizontalAlign="center" tokens={{ childrenGap: 7 }}>
                <Stack style={{ margin: "10px" }} tokens={{ childrenGap: 10 }}>
                  <Text>Discuss the platform with other enthusiasts, get help as a developer, and interact with the devs of your favorite apps</Text>
                  <Link href={Links.discordServerInvite} target="_blank"> Join our discord server </Link>
                </Stack>
                <FontAwesomeIcon style={FaIconStyle} icon={["fab", "discord"]} />
              </Stack>

            </Stack>
          </LinkCard>
        </HoverBox>

        <HoverBox>
          <LinkCard>
            <Stack>
              <Img src={Images.githubOrgScreenshot} />
              <Stack horizontal verticalAlign="center" horizontalAlign="center" tokens={{ childrenGap: 7 }}>
                <Stack style={{ margin: "10px" }} tokens={{ childrenGap: 10 }}>
                  <Text>Many of our projects are open source, so others can learn or build with them</Text>
                  <Link href={Links.githubOrganization} target="_blank">See our open source projects</Link>
                </Stack>
                <FontAwesomeIcon style={FaIconStyle} icon={["fab", "github"]} />
              </Stack>
            </Stack>
          </LinkCard>
        </HoverBox>

        <HoverBox>
          <LinkCard>
            <Stack>
              <Img src={Images.launchHeroImage} />
              <Stack horizontal verticalAlign="center" horizontalAlign="center" tokens={{ childrenGap: 7 }}>
                <Stack style={{ margin: "10px" }} tokens={{ childrenGap: 10 }}>
                  <Text>As a community of talented developers, each year we Launch our projects together in an annual event known as <code>Launch</code></Text>
                  <Link href={Links.launch2019Medium} target="_blank">Read about Launch 2019</Link>
                </Stack>
                <FontAwesomeIcon style={FaIconStyle} icon={["fab", "medium"]} />
              </Stack>
            </Stack>
          </LinkCard>
        </HoverBox>

      </Stack>
    </Stack>
  );
};
