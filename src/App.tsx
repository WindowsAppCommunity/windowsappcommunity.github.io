import * as React from "react";
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import { Projects } from './views/Projects';
import { Home } from './views/Home';
import { AppHeader } from "./components/AppHeader";
import { Launch } from "./views/Launch";
import { Signin } from "./views/signin";
import { Dashboard } from "./views/dashboard";

import { Stack } from "office-ui-fabric-react";

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab, faDiscord, faMedium, faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  fas, faGlobe, faArrowCircleDown, faPlusSquare, faCode, faRobot,
  faList, faHammer, faFrown, faBoxOpen, faRocket, faTimes, faCheckCircle, faInbox, faUserClock, faTrashAlt
} from '@fortawesome/free-solid-svg-icons';

import { withRouter } from 'react-router-dom';
import { NotFound } from "./views/NotFound";
import { registerIcons } from '@uifabric/styling';

import { createMarkdownPage } from './components/markdown-loader'
import { prerenderedLoader } from './components/prerender-loader'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(fab, faDiscord, faMedium, faGithub);
library.add(fas, faGlobe, faArrowCircleDown, faPlusSquare, faCode, faRobot, faList, faHammer,
  faFrown, faBoxOpen, faRocket, faTimes, faCheckCircle, faInbox, faUserClock, faTrashAlt);

registerIcons({
  icons: {
    'Rocket': <FontAwesomeIcon icon={['fas', 'rocket']} />,
    'Robot': <FontAwesomeIcon icon={['fas', 'robot']} />,
    'sad': <FontAwesomeIcon icon={['fas', 'frown']} />,
    'ChromeClose': <FontAwesomeIcon icon={['fas', 'times']} />,
    'Manufacturing': <FontAwesomeIcon icon={['fas', 'hammer']} />,
    'ReceiptCheck': <FontAwesomeIcon icon={['fas', 'check-circle']} />,
    'InboxCheck': <FontAwesomeIcon icon={['fas', 'inbox']} />,
    'ReminderPerson': <FontAwesomeIcon icon={['fas', 'user-clock']} />,
    'AppIconDefaultAdd': <FontAwesomeIcon icon={['fas', 'plus-square']} />,
    'code': <FontAwesomeIcon icon={['fas', 'code']} />,
    'AppIconDefaultList': <FontAwesomeIcon icon={['fas', 'list']} />,
    'BuildDefinition': <FontAwesomeIcon icon={['fas', 'hammer']} />,
    'GiftboxOpen': <FontAwesomeIcon icon={['fas', 'box-open']} />,
    'delete': <FontAwesomeIcon icon={['fas', 'trash-alt']} />,
    'edit': <FontAwesomeIcon icon={['fas', 'edit']} />,
    'signout': <FontAwesomeIcon icon={['fas', 'sign-out-alt']} />,
    'editcontact': <FontAwesomeIcon icon={['fas', 'user-edit']} />,
    'viewdashboard': <FontAwesomeIcon icon={['fas', 'columns']} />,
    'chevrondown': <FontAwesomeIcon icon={['fas', 'chevron-down']} />
  },
});

const AppHeaderWithRouter = withRouter(props => <AppHeader {...props} />);
const PrivacyPolicy = prerenderedLoader(() => createMarkdownPage('/privacy-policy.md'));

export const App: React.StatelessComponent = () => {

  return (
    <BrowserRouter basename="/">
      <Stack horizontalAlign="center">
        <AppHeaderWithRouter />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/projects" component={Projects} />
          <Route exact path="/launch" component={Launch} />
          <Route exact path="/signin" component={Signin} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/privacy-policy" component={PrivacyPolicy} />
          <Route component={NotFound} />
        </Switch>
      </Stack>
    </BrowserRouter>
  );
};
