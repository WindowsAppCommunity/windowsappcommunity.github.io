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
      <Stack style={{ margin: "25px" }} horizontal wrap tokens={{ childrenGap: 10 }} horizontalAlign="space-between">
        <Stack horizontal wrap verticalAlign='end' horizontalAlign="center" >

          <Link href="/">
            <Image src={Images.uwpCommunityLogo} />
          </Link>
          <NavMenu />
        </Stack>

        <Stack verticalAlign="end" style={{ marginBottom: "12px" }}>
          <PrimaryButton>
            <Text>Sign in </Text>
            <FontAwesomeIcon style={FaIconStyle} icon={["fab", "discord"]} />
          </PrimaryButton>
        </Stack>
      </Stack>
    </header>
  );
};
