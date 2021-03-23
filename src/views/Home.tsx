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
height: min-content;
.heroImage, .heroImage img {
  border: none;
  display: flex;
  justify-content: center;
  height: 350px;
}

@media screen and (max-width: 1479px) {
  width: min-content;
  .heroImage, .heroImage img {
      width: 700px;
      height: 350px;
  }
}
`;

export const Home: React.StatelessComponent = () => {
  return (
    <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
      <p style={{ fontFamily: "Segoe UI, Sans-Serif", fontWeight: "lighter", fontSize: "24px", margin: 5 }}>The homepage for the unofficial Discord server </p>

      <Stack horizontal wrap horizontalAlign="space-around" tokens={{ childrenGap: 25 }}>

        <LargeCard>
          <Stack horizontal wrap horizontalAlign="space-evenly">
            <Image className="heroImage" height="350" coverStyle={ImageCoverStyle.landscape} src={Images.launchHeroImage} alt={Images.launchHeroImageAltText}/>

            <Stack style={{ margin: 30, width: 350 }} tokens={{ childrenGap: 5 }} verticalAlign="center">
              <Text variant="xLarge">{HomeViewData.main.subtitle}</Text>
              <Text variant="mediumPlus">{HomeViewData.main.details.map(x => <Text style={{ display: 'block', marginBottom: 10 }}>{x}</Text>)}</Text>
              <Stack horizontal tokens={{ childrenGap: 45}}>
                <PrimaryButton href="https://discord.gg/eBHZSKG" style={{ marginTop: "15px", width: 150, height: 40 }} text="Join us" />
                <PrimaryButton href="/dashboard" style={{ marginTop: "15px", width: 150, height: 40 }} text="Register" />
              </Stack>
            </Stack>
          </Stack>
        </LargeCard>

        <Stack wrap horizontal horizontalAlign="space-around" tokens={{ childrenGap: 15 }}>
          <HoverBox>
            <LinkCard>
              <Stack>
                <Img src={Images.discordChatExample} alt={Images.discordChatExampleAltText}/>

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
                <Img src={Images.githubOrgScreenshot} alt={Images.githubOrgScreenshotAltText}/>
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
                <Img src={Images.launchAppsHero} alt={Images.launchAppsHeroAltText}/>
                <Stack horizontal verticalAlign="center" horizontalAlign="center" tokens={{ childrenGap: 7 }}>
                  <Stack style={{ margin: "10px" }} tokens={{ childrenGap: 10 }}>
                    <Text>As a community of talented developers, each year we Launch our projects together in an annual event known as <code>Launch</code></Text>
                    <Link href={Links.launch2020Medium} target="_blank">Read about Launch 2020</Link>
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
