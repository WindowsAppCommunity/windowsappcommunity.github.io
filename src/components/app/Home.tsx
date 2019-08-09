import React, { CSSProperties } from "react";
import { Stack, Text, Button } from "office-ui-fabric-react";
import { Links, Images } from "../../common/const";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FaIconStyle: CSSProperties = {
  color: "black",
  height: "65px",
  width: "65px"
};

const LinkCard = styled.section`
    font-family: Segoe UI, sans-serif;
    padding: 7px;
    max-width: 400px;
    transition: 150ms all;
`;

const HoverBox = styled.div`
    box-shadow: ${Depths.depth4};
    :hover {
      box-shadow: ${Depths.depth16};
    };
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
    <Stack wrap horizontal horizontalAlign="space-around" gap="25px">
      <HoverBox>
          <Stack wrap horizontal verticalAlign="center" horizontalAlign="space-between">
            <Stack style={{margin: "15px"}}>
              <Text variant="xLargePlus">Launch 2020 signup coming soon</Text>
              <Text variant="mediumPlus">Check back later</Text>
              <Button style={{marginTop : "15px"}} text="Submit your app" disabled />
            </Stack>
            <Img src={Images.launchHeroImage} />
          </Stack>
      </HoverBox>

      <Stack gap="15px" wrap horizontal horizontalAlign="space-around">
        <HoverBox>
          <LinkCard>
            <Stack>
              <Img src={Images.discordChatExample} />

              <Stack horizontal verticalAlign="center" horizontalAlign="center" gap="7px">
                <Stack gap="10px" style={{ margin: "10px" }}>
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
              <Stack horizontal verticalAlign="center" horizontalAlign="center" gap="7px">
                <Stack gap="10px" style={{ margin: "10px" }}>
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
              <Stack horizontal verticalAlign="center" horizontalAlign="center" gap="7px">
                <Stack gap="10px" style={{ margin: "10px" }}>
                  <Text>As a community of talented developers, each year we Launch our projects together in an annnual event known as <code>Launch</code></Text>
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
