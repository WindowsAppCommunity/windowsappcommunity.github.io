import React, { useState, CSSProperties } from "react";
import { Text, Stack, PrimaryButton, IconButton, Image, ImageCoverStyle, ImageFit } from "office-ui-fabric-react";
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HoverBox from '../components/HoverBox';
import { Images } from "../common/const";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import { GetLaunchProjects, IProject } from "../common/services/projects";
import { ProjectCard } from "../components/ProjectCard";
import { GetCurrentDiscordUser, IDiscordUser } from "../common/services/discord";

export const Launch = () => {
    const [projects, setProjects] = React.useState<IProject[]>();
    const [user, setUser] = React.useState<IDiscordUser>();

    async function GetNextLaunchEventProjects() {
        setProjects(await GetLaunchProjects(2020));
    }
    React.useEffect(()=>{
        GetNextLaunchEventProjects();
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

                {projects ? <Text variant="xLarge">Launch 2020 Participants</Text> : <></>}
            <Stack horizontal wrap horizontalAlign="center" tokens={{childrenGap: 25}}>
                {/* Todo: Add launch 2019 summary */}
                {projects ? projects.map(project => <ProjectCard project={project} />) : <></>}
            </Stack>
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

