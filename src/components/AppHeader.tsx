import * as React from "react";
import { Stack, Link } from "office-ui-fabric-react";
import { Image } from "office-ui-fabric-react/lib/Image";
import { Images } from "../common/const";
import { NavMenu } from "./NavMenu";

export const AppHeader: React.StatelessComponent = () => {
  return (
    <header>
      <Stack style={{ margin: "25px" }} horizontal wrap verticalAlign='end' horizontalAlign="center" tokens={{ childrenGap: 10 }}>
        <Link href="/">
          <Image src={Images.uwpCommunityLogo} />
        </Link>
        <NavMenu />
      </Stack>
    </header>
  );
};
