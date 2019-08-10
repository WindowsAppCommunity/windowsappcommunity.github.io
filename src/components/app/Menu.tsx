import React, { CSSProperties } from "react";
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";

const navLinkActiveStyle: CSSProperties = {
  textDecoration: "underline",
  boxShadow: Depths.depth16
};

const MyNavLink = styled(NavLink)`     
   color: black;
   padding: 14px 25px;
   text-align: center;
   text-decoration: none;
   display: inline-block;
   box-shadow: ${Depths.depth4};

   :hover, :active  {
    text-decoration: underline;
    box-shadow: ${Depths.depth16};
  };`;

export class Menu extends React.Component<any, any> {
  public render(): JSX.Element {
    return (
      <nav>
        <MyNavLink to="/" exact activeStyle={navLinkActiveStyle}>
          Home
        </MyNavLink>
        <MyNavLink to="/projects" activeStyle={navLinkActiveStyle}>
          Projects
        </MyNavLink>
      </nav>
    );
  }
}