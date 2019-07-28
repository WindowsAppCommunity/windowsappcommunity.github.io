import * as React from "react";
import { Stack, Link } from "office-ui-fabric-react";

export const Menu: React.StatelessComponent = () => {
  return (
    <Stack horizontalAlign="center">
      <Link href="https://discord.gg/eBHZSKG" target="_blank">Join us on Discord</Link>
      <Link href="https://medium.com/@Arlodottxt/launch-2019-7efd37cc0877" target="_blank">Read the announcement</Link>
    </Stack>
  );
};
