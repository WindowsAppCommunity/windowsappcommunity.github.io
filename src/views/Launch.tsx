import React from "react";
import { Text, Stack, Image, ImageCoverStyle, ImageFit } from "office-ui-fabric-react";

import { Images } from "../common/const";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import { IProject, GetLaunchProjects } from "../common/services/projects";
import { ProjectCard } from "../components/ProjectCard";
import { GetCurrentDiscordUser, IDiscordUser } from "../common/services/discord";
import { PromiseVisualizer } from "../components/PromiseVisualizer";
import styled from "styled-components";
import LaunchViewData from '../assets/views/launch.json';

const PaddedProjectHolder = styled.div`
    padding: 20px 0px 20px 0px;

    @media screen and (min-width: 1200px) {
        padding: 20px 100px 20px 100px;
    }

`;

const LargeCard = styled.div`
box-shadow: ${Depths.depth16};
.heroImage, .heroImage img {
  display: flex;
  justify-content: center;
  width: 750px;
}

width: min-content;

`;

export const Launch = () => {
    const [launch2020Projects, setLaunch2020Projects] = React.useState<IProject[]>();
    const [launch2019Projects, setLaunch2019Projects] = React.useState<IProject[]>();
    const [user, setUser] = React.useState<IDiscordUser>();

    React.useEffect(() => {
        (async () => {
            setUser(await GetCurrentDiscordUser());
        })();
    }, []);

    return (
        <Stack tokens={{ childrenGap: 25 }} horizontalAlign="center">

            <LargeCard>
                <Stack horizontal wrap>
                    <Image className="heroImage" src={Images.launchAppsHero} coverStyle={ImageCoverStyle.landscape} />
                    <Stack style={{ margin: "20px 50px 20px 50px" }}>

                        <Text style={{ fontFamily: "Segoe UI", fontSize: "30px", fontWeight: "lighter" }}>{LaunchViewData.main.title}</Text>

                        <Text style={{ marginTop: "10px", fontWeight: 500 }} variant="xLarge">{LaunchViewData.main.subtitle}</Text>
                        {
                            LaunchViewData.main.details.map(x => {
                                return (
                                    <Text style={{ marginTop: "10px" }} variant="mediumPlus" key={x}>{x}</Text>
                                )
                            })
                        }
                    </Stack>
                </Stack>
            </LargeCard>

            <PromiseVisualizer promise={GetLaunchProjects(2020)} onResolve={setLaunch2020Projects} loadingMessage="Checking for Launch 2020 Participants">
                <PaddedProjectHolder>
                    <Stack horizontalAlign="center" tokens={{ childrenGap: 15 }}>
                        <Text variant="xLarge">Launch 2020 Participants</Text>
                        <Stack horizontal wrap horizontalAlign="center" maxWidth={1800} tokens={{ childrenGap: 25 }}>
                            {launch2020Projects && launch2020Projects.length && launch2020Projects.map((project, i) =>
                                <ProjectCard key={i} project={project} />
                            )}
                        </Stack>
                    </Stack>
                </PaddedProjectHolder>
            </PromiseVisualizer>

            <PromiseVisualizer promise={GetLaunchProjects(2019)} onResolve={setLaunch2019Projects} loadingMessage="Checking for Launch 2019 Participants">
                <PaddedProjectHolder>
                    <Stack horizontalAlign="center" tokens={{ childrenGap: 15 }}>
                        <Text variant="xLarge">Launch 2019 Participants</Text>
                        <Stack horizontal wrap horizontalAlign="center" maxWidth={1800} tokens={{ childrenGap: 25 }}>
                            {launch2019Projects && launch2019Projects.length && launch2019Projects.map((project, i) =>
                                <ProjectCard key={i} project={project} />
                            )}
                        </Stack>
                    </Stack>
                </PaddedProjectHolder>
            </PromiseVisualizer>
        </Stack>
    );
};

/* interface ILaunchCardProps {
    header: string;
    description: string;
    path: string;
    buttonText?: string;
    buttonDisabled?: boolean;
    buttonStyle?: CSSProperties;
}; */
