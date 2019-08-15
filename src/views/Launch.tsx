import React, { useState, CSSProperties } from "react";
import { Text, Stack, Button, IconButton, Image, ImageCoverStyle, ImageFit } from "office-ui-fabric-react";
import { Route } from "react-router";
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import HoverBox from '../components/HoverBox';
import { Images } from "../common/const";
import { Participants } from "../views/launch/participants";
import { Signup } from "../views/launch/signup";

export const Launch: React.StatelessComponent<any> = ({ match }: any) => {
    return (
        <Stack>
            <Route path={`${match.path}/participants`} component={Participants} />
            <Route path={`${match.path}/signup`} component={Signup} />
            <Route exact path={match.path} component={LaunchViewSelection} />
        </Stack>
    );
};

const LaunchViewSelection = () => {
    return (
        <Stack tokens={{childrenGap: 25}}>
            <HoverBox>
                <Stack horizontal wrap>
                    <Image width="100%" height="400px" src={Images.launchAppsHero} coverStyle={ImageCoverStyle.landscape} imageFit={ImageFit.cover} />
                    <Stack style={{margin: "20px"}}>
                        <Text variant="xLargePlus">//Launch</Text>
                        <Text variant="large">An annual event where a community of Windows App developers release their UWP-related projects</Text>
                        <Text style={{marginTop: "10px"}}>Our Discord server provides direct, 2 way user feedback from users, and a place for newbies to ask questions and learn from those with more experience, creating the perfect environment for apps to grow into something more</Text>
                    </Stack>
                </Stack>
            </HoverBox>
            <Stack horizontal wrap horizontalAlign="center" tokens={{childrenGap: 25}}>
                <LaunchCard header="Participating apps" description="See which apps are participating in Launch 2020" path="/launch/participants" />

                <LaunchCard header="Submit your app" description="Want to Launch your app with the community?" buttonText="Sign up now" path="/launch/signup" buttonDisabled={true} />                    
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
};
const LaunchCardStyle = styled(HoverBox)`
    max-height: 500px;
    max-width: 300px;
    padding: 50px;
    :hover {
                pointer: cursor;
        };
    `;

const LaunchCard: React.FC<ILaunchCardProps> = (props: ILaunchCardProps) => {
    return (
        <LaunchCardStyle>
            <Stack>
                <Stack horizontal tokens={{ childrenGap: 5 }}>
                    <Text variant="xLarge">{props.header}</Text>
                    <NavLink to={(props.buttonDisabled? window.location.pathname : props.path)}>
                        {
                            props.buttonText ?
                                <Button disabled={props.buttonDisabled} style={{ marginLeft: "10px" }} text={props.buttonText} />
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
