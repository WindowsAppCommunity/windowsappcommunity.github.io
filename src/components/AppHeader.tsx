import * as React from "react";
import { Stack, Link, Text, PrimaryButton, Persona, TooltipHost, TooltipDelay, DefaultButton, IContextualMenuProps, IContextualMenuItem, PersonaSize, Dialog, DialogFooter, DialogType } from "office-ui-fabric-react";
import { Images, Links } from "../common/const";
import { NavMenu } from "./NavMenu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSProperties } from "react";
import { Route } from 'react-router-dom';

import { GetUserAvatar, GetCurrentUser, IDiscordUser, AuthData, IsUserInServer, discordAuthEndpoint } from "../common/services/discord";
import { Helmet } from "react-helmet";
import { getHeadTitle } from "../common/helpers";
import { History } from "history";
import { RegisterDevForm } from "./forms/RegisterDev";

const FaIconStyle: CSSProperties = {
  color: "white",
  height: "20px",
  width: "20px",
  paddingLeft: "10px"
};

export const AppHeader: React.StatelessComponent = (props: any) => {
  return (
    <Route render={({ history }) => (
      <header style={{ marginBottom: "10px", maxWidth: "98vw" }}>
        <Stack style={{ width: "100vw", margin: "0px" }} horizontal wrap tokens={{ childrenGap: 10 }} verticalAlign='end' horizontalAlign="space-around">
          <Helmet>
            <title>{getHeadTitle(props.location.pathname)}</title>
          </Helmet>
          <Link href="/">
            {/* This is an img and not an Image from FabricUI because when rendered on the live server, the image randomly doesn't show */}
            <img style={{ maxWidth: "100vw" }} src={Images.uwpCommunityLogo} alt="uwpCommunityLogo"/>
          </Link>

          <NavMenu />

          <SignInButton history={history} />
        </Stack>

      </header>
    )} />
  );
};

export const SignInButton: React.FC<{ history: History }> = ({ history }) => {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState<IDiscordUser>();
  const [userAvatar, setUserAvatar] = React.useState<string>();
  const [joinServerAlertHidden, setJoinServerAlertHidden] = React.useState(true);
  const [editProfileShown, setEditProfileShown] = React.useState(false);

  React.useEffect(() => {
    setupLoggedInUser();
  }, []);

  async function setupLoggedInUser() {
    const user = await GetCurrentUser();
    const avatarUrl = await GetUserAvatar(user);
    if (!user || !avatarUrl) return;
    setLoggedIn(true);
    setUser(user);

    let userIsInServer = await IsUserInServer();
    if (!userIsInServer) {
      setJoinServerAlertHidden(false);
      return;
    }

    
    setUserAvatar(await GetUserAvatar(user));
  }

  const LoggedInButtonDropdownItems: IContextualMenuProps = {
    onItemClick: OnMenuItemClick,
    useTargetWidth: true,
    items: [{
      key: "dashboard",
      text: "Dashboard",
      iconProps: { iconName: "ViewDashboard" }
    }, {
      /* Todo: Only show this button if the user HAS a profile to edit */
      key: "editProfile",
      text: "Edit Profile",
      iconProps: { iconName: "EditContact" }
    }, {
      key: "logOut",
      text: "Log out",
      iconProps: { iconName: "SignOut" }
    }]
  }

  function OnMenuItemClick(ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined, item?: IContextualMenuItem | undefined) {
    if (!item) return;

    switch (item.key) {
      case "logOut":
        LogOut();
        break;
      case "dashboard":
        history.push("/dashboard");
        break;
      case "editProfile":
        setEditProfileShown(true);
        break;
    }
  }

  function LogOut() {
    AuthData.Clear();
    history.push("/");
    window.location.reload();
  }

  function CloseJoinServerDialog() {
    setJoinServerAlertHidden(true);
    LogOut();
  }


  return (
    loggedIn && user ?
      <Stack>
        <Dialog
          hidden={joinServerAlertHidden}
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
            <DefaultButton onClick={CloseJoinServerDialog} text="Sign out" />
          </DialogFooter>
        </Dialog>
        <TooltipHost content={`Logged in as ${user.username}`} delay={TooltipDelay.long}>
          <DefaultButton style={{ padding: "25px", border: "0px solid black" }} menuProps={LoggedInButtonDropdownItems}>
            <Persona size={PersonaSize.size40} text={user.username} imageUrl={userAvatar} />
          </DefaultButton>
        </TooltipHost>

        <Dialog isOpen={editProfileShown} dialogContentProps={{ type: DialogType.largeHeader, title: "Edit profile" }}>
          <RegisterDevForm onCancel={() => setEditProfileShown(false)} />
        </Dialog>
      </Stack>
      :
      <Stack verticalAlign="start" style={{ marginBottom: "22px" }}>
        <PrimaryButton href={discordAuthEndpoint} style={{ padding: "18px" }}>
          <Text>Sign in</Text>
          <FontAwesomeIcon style={FaIconStyle} icon={["fab", "discord"]} />
        </PrimaryButton>
      </Stack>
  );
};