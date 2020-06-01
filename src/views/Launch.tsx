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

export const Launch = () => {
    const [launchProjects, setLaunchProjects] = React.useState<IProject[]>();
    const [user, setUser] = React.useState<IDiscordUser>();

    React.useEffect(()=>{
        (async () => {
            setUser(await GetCurrentDiscordUser());
        })();
    }, []);

    return (
        <Stack tokens={{childrenGap: 25}} horizontalAlign="center">
            <Stack horizontal wrap style={{ boxShadow: Depths.depth16 }} maxWidth="1200px">
                <Image width="100%" height="400px" src={Images.launchAppsHero} coverStyle={ImageCoverStyle.landscape} imageFit={ImageFit.cover} />
                <Stack style={{margin: "20px 50px 20px 50px"}}>

                    <Text style={{fontFamily: "Segoe UI", fontSize: "30px", fontWeight: "lighter"}}>{LaunchViewData.main.title}</Text>

                    <Text style={{marginTop: "10px", fontWeight: 500}} variant="xLarge">{LaunchViewData.main.subtitle}</Text>
                    <Text style={{ marginTop: "10px" }} variant="mediumPlus">{LaunchViewData.main.details[0]}</Text>
                    <Text style={{ marginTop: "10px" }} variant="mediumPlus">{LaunchViewData.main.details[1]}</Text>
                </Stack>
            </Stack>

            <PromiseVisualizer promise={GetLaunchProjects(2020)} onResolve={setLaunchProjects} loadingMessage="Checking for Launch 2020 Participants">
                <PaddedProjectHolder>
                    <Stack horizontalAlign="center" tokens={{ childrenGap: 15 }}>

                        <Text variant="xLarge">Launch 2020 Participants</Text>
                        <Stack horizontal wrap horizontalAlign="center" maxWidth={1800} tokens={{ childrenGap: 25 }}>
                            {launchProjects && launchProjects.length && launchProjects.map((project, i) => 
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
