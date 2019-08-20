import * as React from "react";
import { Stack, Link } from "office-ui-fabric-react";
import { Image } from "office-ui-fabric-react/lib/Image";
import { Images } from "../common/const";
import { NavMenu } from "./NavMenu";
import { Helmet } from "react-helmet";
import { getHeadTitle } from "../common/helpers";

export const AppHeader: React.StatelessComponent = (props: any) => {
  return (
    <header>
      <Stack horizontal wrap verticalAlign='end' horizontalAlign="center" tokens={{ childrenGap: 10 }}>
        <Helmet>
          <title>{getHeadTitle(props.location.pathname)}</title>
        </Helmet>
        <Link href="/">
          <Image src={Images.uwpCommunityLogo} />
        </Link>
        <NavMenu />
      </Stack>
      <p style={{ fontFamily: "Segoe UI, Sans-Serif", fontWeight: "lighter", fontSize: "24px", margin: "10px" }}>The homepage for the unofficial Discord server </p>
    </header>
  );
};
