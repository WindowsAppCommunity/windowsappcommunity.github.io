import React, { CSSProperties } from "react";
import { Stack, Text, PrimaryButton, Image, ImageFit, ImageCoverStyle } from "office-ui-fabric-react";
import { Links, Images } from "../common/const";
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HoverBox from '../components/HoverBox';
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import HomeViewData from '../assets/views/home.json';

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

const LargeCard = styled.div`
box-shadow: ${Depths.depth16};
.heroImage, .heroImage img {
  width: 720px;
  height: 350px;
}

@media screen and (max-width: 1479px) {
  width: min-content;
  .heroImage, .heroImage img {
      width: 850px;
      height: 350px;
  }
}
`;

export const Home: React.StatelessComponent = () => {
  return (
    <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
      <p style={{ fontFamily: "Segoe UI, Sans-Serif", fontWeight: "lighter", fontSize: "24px", margin: 0 }}>The homepage for the unofficial Discord server </p>

      <Stack wrap horizontal horizontalAlign="space-around" tokens={{ childrenGap: 25 }}>

        <LargeCard>
          <Stack horizontal wrap maxWidth="1400px" horizontalAlign="space-evenly">
            <Image className="heroImage" coverStyle={ImageCoverStyle.landscape} imageFit={ImageFit.cover} src={Images.launchAppsHero} />

            <Stack style={{ margin: 30 }} tokens={{ childrenGap: 5 }} verticalAlign="center">
              <Text variant="xLarge">{HomeViewData.main.subtitle}</Text>
              <Text variant="mediumPlus">{HomeViewData.main.details}</Text>
              <PrimaryButton href="/launch" style={{ marginTop: "15px", width: 150, height: 40 }} text="Take a look" />
            </Stack>
          </Stack>
        </LargeCard>

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
    </Stack>
  );
};
