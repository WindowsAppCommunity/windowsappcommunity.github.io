import * as React from "react";
import { Stack, Link, Text, PrimaryButton } from "office-ui-fabric-react";
import { Image } from "office-ui-fabric-react/lib/Image";
import { Images } from "../common/const";
import { NavMenu } from "./NavMenu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSProperties } from "react";
import styled from "styled-components";

import { Helmet } from "react-helmet";
import { getHeadTitle } from "../common/helpers";

const FaIconStyle: CSSProperties = {
  color: "white",
  height: "20px",
  width: "20px",
  paddingLeft: "10px"
};

const NavArea = styled.div`

margin-right: 90px;
     
@media screen and (max-width: 1079px) {
  margin-right: 0px;
}
`;

export const AppHeader: React.StatelessComponent = (props: any) => {
  return (
    <header style={{ margin: "10px" }}>
      <Stack style={{ width: "100vw", margin: "0px" }} horizontal wrap tokens={{ childrenGap: 10 }} verticalAlign='end' horizontalAlign="space-around">
        <Helmet>
          <title>{getHeadTitle(props.location.pathname)}</title>
        </Helmet>
        <Link href="/">
          <Image src={Images.uwpCommunityLogo} />
        </Link>

        <NavArea>
          <NavMenu />
        </NavArea>

        <Stack verticalAlign="start" style={{ marginBottom: "22px" }}>
          <PrimaryButton href="/signin" style={{ padding: "18px" }} disabled>
            <Text>Sign in</Text>
            <FontAwesomeIcon style={FaIconStyle} icon={["fab", "discord"]} />
          </PrimaryButton>
        </Stack>
      </Stack>

    </header>
  );
};
