import React, { useState, CSSProperties } from "react";
import { Text, Stack, PrimaryButton, IconButton, Image, ImageCoverStyle, ImageFit } from "office-ui-fabric-react";
import { Route } from "react-router";
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HoverBox from '../components/HoverBox';
import { Images } from "../common/const";
import { Participants } from "../views/launch/participants";
import { Signin } from "./signin";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";

const FaIconStyle: CSSProperties = {
    color: "white",
    height: "20px",
    width: "20px",
    paddingLeft: "10px"
};
export const Launch: React.StatelessComponent<any> = ({ match }: any) => {
    return (
        <Stack>
            <Route path={`${match.path}/participants`} component={Participants} />
            <Route path={`/signin`} component={Signin} />
            <Route exact path={match.path} component={LaunchViewSelection} />
        </Stack>
    );
};


const LaunchViewSelection = () => {
    const [launchButtonDisabled, setLaunchButtonDisabled] = useState<boolean>(true);

    document.addEventListener("keydown", (ev:any)=>{
        if(ev.keyCode === 27) setLaunchButtonDisabled(false);
    });
    
    return (
        <Stack tokens={{childrenGap: 25}}>
                <Stack horizontal wrap style={{ boxShadow: Depths.depth16 }} maxWidth="1200px">
                    <Image width="100%" height="400px" src={Images.launchAppsHero} coverStyle={ImageCoverStyle.landscape} imageFit={ImageFit.cover} />
                    <Stack style={{margin: "20px"}}>

                        <Text style={{fontFamily: "Segoe UI", fontSize: "30px", fontWeight: "lighter"}}>// Launch</Text>

                        <Text style={{marginTop: "10px", fontWeight: 500}} variant="xLarge">Learn, develop, and Launch together</Text>
                        <Text style={{marginTop: "10px"}} variant="mediumPlus">Once a year, our community of Windows App developers join together to release their UWP-related projects. If you’re a developer, new or veteran, then we HIGHLY encourage you to join the server and register your app for the next Launch event!</Text>
                    </Stack>
                </Stack>

            <Stack horizontal wrap horizontalAlign="center" tokens={{childrenGap: 25}}>
                <LaunchCard header="Participating apps" description="See which apps are participating in Launch 2020" path="/launch/participants" buttonDisabled={launchButtonDisabled} />

                <LaunchCard header="Submit your app" description="Want to Launch your app with the community?" path="/signin" buttonStyle={{paddingTop: "25px", paddingBottom: "25px", marginLeft: "10px"}}  buttonDisabled={launchButtonDisabled}>
                    <Text>Sign in </Text>
                    <FontAwesomeIcon style={FaIconStyle} icon={["fab", "discord"]} />
                </LaunchCard>
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

const LaunchCard: React.FunctionComponent<ILaunchCardProps> = (props: React.PropsWithChildren<ILaunchCardProps>) => {
    return (
        <LaunchCardStyle>
            <Stack tokens={{childrenGap: 5}}>
                <Stack horizontal tokens={{ childrenGap: 5 }} verticalAlign="center">
                    <Text variant="xLarge">{props.header}</Text>
                    <NavLink to={(props.buttonDisabled? window.location.pathname : props.path)}>
                        {
                            props.buttonText || props.children ?
                                <PrimaryButton primary disabled={props.buttonDisabled} style={props.buttonStyle} text={props.buttonText}>{props.children}</PrimaryButton>
                                :
                                <IconButton disabled={props.buttonDisabled} primary iconProps={{ iconName: 'Go' }} />
                        }
                    </NavLink>
                </Stack>
                <Text variant="medium">{props.description}</Text>
            </Stack>
        </LaunchCardStyle>
    )
};
