import * as React from "react";
import { Stack, Link } from "office-ui-fabric-react";
import { Image } from "office-ui-fabric-react/lib/Image";
import { Images, Links } from "../../common/const";

const itemStyles: React.CSSProperties = {
  display: 'flex'
};

export const Header: React.StatelessComponent = () => {
  return (
    <Stack>
      <Stack horizontal horizontalAlign="center">
        <Link href="/">
          <Image src={Images.uwpCommunityLogo} />
        </Link>
      </Stack>
      <header style={{ fontFamily: "Segoe UI, Sans-Serif", fontWeight: "lighter", fontSize: "24px" }}>The unofficial UWP Community Discord Server </header>
    </Stack>
  );
};
