import * as React from "react";
import { Stack, Link, Text, PrimaryButton, Persona, TooltipHost, TooltipDelay, DefaultButton, IContextualMenuProps, IContextualMenuItem, PersonaSize, Dialog, DialogFooter, DialogType } from "office-ui-fabric-react";
import { Images, Links } from "../common/const";
import { NavMenu } from "./NavMenu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSProperties } from "react";

import { GetUserAvatar, GetCurrentUser, IDiscordUser, AuthData, IsUserInServer } from "../common/discordService";
import { Helmet } from "react-helmet";
import { getHeadTitle } from "../common/helpers";
import { constants } from "crypto";

const FaIconStyle: CSSProperties = {
  color: "white",
  height: "20px",
  width: "20px",
  paddingLeft: "10px"
};

export const AppHeader: React.StatelessComponent = (props: any) => {
  return (
    <header style={{ margin: "10px" }}>
      <Stack style={{ width: "100vw", margin: "0px" }} horizontal wrap tokens={{ childrenGap: 10 }} verticalAlign='end' horizontalAlign="space-around">
        <Helmet>
          <title>{getHeadTitle(props.location.pathname)}</title>
        </Helmet>
        <Link href="/">
          {/* This is an img and not an Image from FabricUI because when rendered on the live server, the image randomly doesn't show */}
          <img src={Images.uwpCommunityLogo} />
        </Link>

        <NavMenu />

        <SignInButton />
      </Stack>

    </header>
  );
};

export const SignInButton: React.FC = () => {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState<IDiscordUser>();
  const [userAvatar, setUserAvatar] = React.useState<string>();
  const [joinServerAlertShown, setJoinServerAlertShown] = React.useState(false);

  React.useEffect(() => {
    setupLoggedInUser();
  }, []);

  async function setupLoggedInUser() {
    const user = await GetCurrentUser();
    const avatarUrl = await GetUserAvatar(user);
    if (!user || !avatarUrl) return;
    setLoggedIn(true);
    setUser(user);

    if (!(await IsUserInServer())) {
      setJoinServerAlertShown(true);
      return;
    }

    setUserAvatar(await GetUserAvatar(user));
  }

  const LoggedInButtonDropdownItems: IContextualMenuProps = {
    onItemClick: OnMenuItemClick,
    items: [{
      key: "logOut",
      text: "Log out",
      iconProps: { iconName: "SignOut" }
    }]
  }

  function OnMenuItemClick(ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined, item?: IContextualMenuItem | undefined) {
    if (item && item.key == "logOut") LogOut();
  }

  function LogOut() {
    AuthData.Clear();
    window.location.reload();
  }

  function CloseJoinServerDialog() {
    setJoinServerAlertShown(false);
    LogOut();
  }

  return (
    loggedIn && user ?
      <Stack style={{ marginBottom: "10px" }}>
        <Dialog
          hidden={joinServerAlertShown}
          dialogContentProps={{
            type: DialogType.normal,
            title: "Join the Community to continue",
            subText: "Looks like you aren't part of the UWP Community. To sign in, you'll need to join the server first"
          }}
          modalProps={{
            isBlocking: true,
            styles: { main: { maxWidth: 450 } }
          }}
        >
          <DialogFooter>
            <PrimaryButton href={Links.discordServerInvite} text="Join the server" />
            <DefaultButton onClick={CloseJoinServerDialog} text="Cancel" />
          </DialogFooter>
        </Dialog>
        <TooltipHost content={`Logged in as ${user.username}`} delay={TooltipDelay.long}>
          <DefaultButton style={{ padding: "25px", border: "0px solid black" }} menuProps={LoggedInButtonDropdownItems}>
            <Persona size={PersonaSize.size40} text={user.username} imageUrl={userAvatar} />
          </DefaultButton>
        </TooltipHost>
      </Stack>
      :
      <Stack verticalAlign="start" style={{ marginBottom: "22px" }}>
        <PrimaryButton href="/signin" style={{ padding: "18px" }}>
          <Text>Sign in</Text>
          <FontAwesomeIcon style={FaIconStyle} icon={["fab", "discord"]} />
        </PrimaryButton>
      </Stack>
  );
};