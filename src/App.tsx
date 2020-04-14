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
import { fas, faGlobe, faArrowCircleDown, faPlusSquare, faCode, faRobot, 
  faList, faHammer, faFrown, faBoxOpen, faRocket, faTimes, faCheckCircle, faInbox, faUserClock } from '@fortawesome/free-solid-svg-icons';

import { withRouter } from 'react-router-dom';
import { NotFound } from "./views/NotFound";

import { createMarkdownPage } from './components/markdown-loader'
import { prerenderedLoader } from './components/prerender-loader'

library.add(fab, faDiscord, faMedium, faGithub);
library.add(fas, faGlobe, faArrowCircleDown, faPlusSquare, faCode, faRobot, faList, faHammer, 
  faFrown, faBoxOpen, faRocket, faTimes, faCheckCircle, faInbox, faUserClock);

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
