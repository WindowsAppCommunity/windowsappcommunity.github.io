import * as React from "react";
import { Stack, Link, Text, Button, PrimaryButton } from "office-ui-fabric-react";
import { Image } from "office-ui-fabric-react/lib/Image";
import { Images } from "../common/const";
import { NavMenu } from "./NavMenu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSProperties } from "react";

const FaIconStyle: CSSProperties = {
  color: "white",
  height: "20px",
  width: "20px",
  paddingLeft: "10px"
};

export const AppHeader: React.StatelessComponent = () => {
  return (
    <header>
      <Stack style={{ width: "100vw", margin: "25px" }} horizontal wrap tokens={{ childrenGap: 25 }} verticalAlign='end' horizontalAlign="space-between">

        <Link href="/">
          <Image style={{ marginLeft: "25px" }} src={Images.uwpCommunityLogo} />
        </Link>
        <NavMenu />

        <Stack verticalAlign="start" style={{ marginBottom: "22px" }}>
          <Link href="/singin">
            <PrimaryButton style={{ padding: "18px"}}>
              <Text>Sign in</Text>
              <FontAwesomeIcon style={FaIconStyle} icon={["fab", "discord"]} />
            </PrimaryButton>
          </Link>
        </Stack>
      </Stack>

    </header>
  );
};
