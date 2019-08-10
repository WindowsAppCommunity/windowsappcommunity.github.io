import * as React from "react";
import { Stack, Link } from "office-ui-fabric-react";
import { Image } from "office-ui-fabric-react/lib/Image";
import { Images } from "../common/const";
import { NavMenu } from "./NavMenu";

export const AppHeader: React.StatelessComponent = () => {
  return (
    <header>
      <Stack horizontal wrap verticalAlign='end' horizontalAlign="center" tokens={{childrenGap:10}}>
        <Link href="/">
          <Image src={Images.uwpCommunityLogo} />
        </Link>
        <NavMenu />
      </Stack>
      <p style={{ fontFamily: "Segoe UI, Sans-Serif", fontWeight: "lighter", fontSize: "24px", margin: "10px" }}>The homepage for the unofficial Discord server </p>
    </header>
  );
};
