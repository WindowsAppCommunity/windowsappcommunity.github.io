import * as React from "react";
import { Stack, Link } from "office-ui-fabric-react";
import { Image } from "office-ui-fabric-react/lib/Image";
import { Images } from "../../common/const";
import { Menu } from "./Menu";

export const Header: React.StatelessComponent = () => {
  return (
    <header>
      <Stack horizontal wrap verticalAlign='end' horizontalAlign="center" gap="10px">
        <Link href="/">
          <Image src={Images.uwpCommunityLogo} />
        </Link>
        <Menu />
      </Stack>
      <p style={{ fontFamily: "Segoe UI, Sans-Serif", fontWeight: "lighter", fontSize: "24px", margin: "10px" }}>The homepage for the unofficial Discord server </p>
    </header>
  );
};
