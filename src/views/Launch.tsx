import React, { useState, CSSProperties } from "react";
import { Text, Stack, Button, IconButton } from "office-ui-fabric-react";
import { Route } from "react-router";
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import HoverBox from '../components/HoverBox';

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
        <Stack>
            
            <Stack horizontal wrap>
                <LaunchCard header="Participating apps" description="See which apps are participating in Launch 2020" path="/launch/participants" />

                <LaunchCard header="Submit your app" description="Want to Launch your app with the community?" buttonText="Sign up now" path="/launch/signup" />
            </Stack>
        </Stack>
    );
};

interface ILaunchCardProps {
    header: string;
    description: string;
    path: string;
    buttonText?: string;
};
const LaunchCardStyle = styled(HoverBox)`
    max-height: 500px;
    max-width: 300px;
    padding: 50px;
    margin: 50px;
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
                    <NavLink to={props.path}>
                        {
                            props.buttonText ?
                                <Button style={{ marginLeft: "10px" }} text={props.buttonText} />
                                :
                                <IconButton primary iconProps={{ iconName: 'Go' }} />
                        }
                    </NavLink>
                </Stack>
                <Text variant="medium">{props.description}</Text>
            </Stack>
        </LaunchCardStyle>
    )
};
