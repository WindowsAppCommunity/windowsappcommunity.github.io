import React, { CSSProperties } from "react";
import { Text, Stack, Image, ImageCoverStyle, ImageFit } from "office-ui-fabric-react";
import styled from 'styled-components';

import HoverBox from '../components/HoverBox';
import { Images } from "../common/const";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import { IProject, GetLaunchProjects } from "../common/services/projects";
import { ProjectCard } from "../components/ProjectCard";
import { GetCurrentDiscordUser, IDiscordUser } from "../common/services/discord";
import { PromiseVisualizer } from "../components/PromiseVisualizer";

export const Launch = () => {
    const [launchProjects, setLaunchProjects] = React.useState<IProject[]>();
    const [user, setUser] = React.useState<IDiscordUser>();

    React.useEffect(()=>{
        (async () => {
            setUser(await GetCurrentDiscordUser());
        })();
    }, []);

    return (
        <Stack tokens={{childrenGap: 25}}>
            <Stack horizontal wrap style={{ boxShadow: Depths.depth16 }} maxWidth="1200px">
                <Image width="100%" height="400px" src={Images.launchAppsHero} coverStyle={ImageCoverStyle.landscape} imageFit={ImageFit.cover} />
                <Stack style={{margin: "20px"}}>

                    <Text style={{fontFamily: "Segoe UI", fontSize: "30px", fontWeight: "lighter"}}>// Launch</Text>

                    <Text style={{marginTop: "10px", fontWeight: 500}} variant="xLarge">Learn, develop, and Launch together</Text>
                    <Text style={{marginTop: "10px"}} variant="mediumPlus">Once a year, our community of Windows App developers join together to release their UWP-related projects. If you’re a developer, new or veteran, then we HIGHLY encourage you to join the server and register your app for the next Launch event!</Text>
                    <Text style={{marginTop: "10px"}} variant="large">{ user ? "Go to your dashboard to get started" : ""}</Text>
                </Stack>
            </Stack>

            <PromiseVisualizer promise={GetLaunchProjects(2020)} onResolve={setLaunchProjects} loadingMessage="Checking for Launch 2020 Participants">
            <Text variant="xLarge">Launch 2020 Participants</Text>
            <Stack horizontal wrap horizontalAlign="center" tokens={{childrenGap: 25}}>
                {launchProjects && launchProjects.length && launchProjects.map((project, i) => 
                    <ProjectCard key={i} project={project} />
                )}
            </Stack>
            </PromiseVisualizer>
        </Stack>
    );
};

interface ILaunchCardProps {
    header: string;
    description: string;
    path: string;
    buttonText?: string;
    buttonDisabled?: boolean;
    buttonStyle?: CSSProperties;
};

const LaunchCardStyle = styled(HoverBox)`
    max-height: 500px;
    max-width: 350px;
    padding: 50px;
    :hover {
                pointer: cursor;
        };
    `;

