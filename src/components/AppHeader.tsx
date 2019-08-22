import * as React from "react";
import { Stack, Link, Text, PrimaryButton } from "office-ui-fabric-react";
import { Image } from "office-ui-fabric-react/lib/Image";
import { Images } from "../common/const";
import { NavMenu } from "./NavMenu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSProperties } from "react";
import styled from "styled-components";

const FaIconStyle: CSSProperties = {
  color: "white",
  height: "20px",
  width: "20px",
  paddingLeft: "10px"
};

const NavArea = styled.div`
     margin-left: -90px;
`;

export const AppHeader: React.StatelessComponent = () => {
  return (
    <header style={{ margin: "10px" }}>
      <Stack style={{ width: "100vw", margin: "0px" }} horizontal wrap tokens={{ childrenGap: 25 }} verticalAlign='end' horizontalAlign="space-around">

        <Link href="/">
          <Image src={Images.uwpCommunityLogo} />
        </Link>

        <NavArea>
          <NavMenu />
        </NavArea>

        <Stack verticalAlign="start" style={{ marginBottom: "22px" }}>
          <Link href="/signin">
            <PrimaryButton style={{ padding: "18px" }}>
              <Text>Sign in</Text>
              <FontAwesomeIcon style={FaIconStyle} icon={["fab", "discord"]} />
            </PrimaryButton>
          </Link>
        </Stack>
      </Stack>

    </header>
  );
};
