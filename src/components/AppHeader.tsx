import * as React from "react";
import { Stack, Link, Text, PrimaryButton, Persona, TooltipHost, TooltipDelay, DefaultButton, IContextualMenuProps, IContextualMenuItem, PersonaSize, Dialog, DialogFooter, DialogType } from "office-ui-fabric-react";
import { Images, Links } from "../common/const";
import { NavMenu } from "./NavMenu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSProperties } from "react";
import { Route } from 'react-router-dom';

import { GetUserAvatar, GetCurrentDiscordUser, IDiscordUser, AuthData, IsUserInServer, discordAuthEndpoint } from "../common/services/discord";
import { Helmet } from "react-helmet";
import { getHeadTitle } from "../common/helpers";
import { History } from "history";
import { RegisterUserForm } from "./forms/RegisterUser";
import { GetUser, IUser } from "../common/services/users";

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
            <img style={{ maxWidth: "100vw" }} src={Images.uwpCommunityLogo} alt="Uwp Community Logo" />
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
  const [discordUser, setDiscordUser] = React.useState<IDiscordUser>();
  const [user, setUser] = React.useState<IUser>();
  const [userAvatar, setUserAvatar] = React.useState<string>();
  const [joinServerAlertHidden, setJoinServerAlertHidden] = React.useState(true);
  const [registerUserShown, setRegisterUserShown] = React.useState(false);
  const [editProfileShown, setEditProfileShown] = React.useState(false);

  React.useEffect(() => {
    setupLoggedInUser();
  }, []);

  async function setupLoggedInUser() {
    const discordUser = await GetCurrentDiscordUser();
    const avatarUrl = await GetUserAvatar(discordUser);

    if (!discordUser || !avatarUrl) return;
    setLoggedIn(true);
    setDiscordUser(discordUser);

    let userIsInServer = await IsUserInServer();
    if (!userIsInServer) {
      setJoinServerAlertHidden(false);
      return;
    }

    const userRequest = await GetUser(discordUser.id);
    if (userRequest.status === 404) {
      // User isn't registered
      alert("User not registered");
      setRegisterUserShown(true);
      return;
    }
    if (userRequest && userRequest.status !== 200) throw new Error(await userRequest.text());

    let user: IUser = await userRequest.json();

    setUser(user);
    setUserAvatar(avatarUrl);
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
    loggedIn && discordUser ?
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
        <TooltipHost content={`Logged in as ${discordUser.username}`} delay={TooltipDelay.long}>
          <DefaultButton style={{ padding: "25px", border: "0px solid black" }} menuProps={LoggedInButtonDropdownItems}>
            <Persona size={PersonaSize.size40} text={discordUser.username} imageUrl={userAvatar} />
          </DefaultButton>
        </TooltipHost>

        <Dialog hidden={!editProfileShown} dialogContentProps={{ type: DialogType.largeHeader, title: registerUserShown ? "One more step" : "Edit profile" }}>
          <RegisterUserForm onSuccess={() => setEditProfileShown(false)} onCancel={() => setEditProfileShown(false)} />
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