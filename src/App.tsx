import * as React from "react";
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import { Projects } from './views/Projects';
import { Home } from './views/Home';
import { AppHeader } from "./components/AppHeader";
import { Launch } from "./views/Launch";
import { Signin } from "./views/signin";
import { Dashboard } from "./views/dashboard";

import { Stack } from "@fluentui/react";

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab, faDiscord, faMedium, faGithub } from '@fortawesome/free-brands-svg-icons';
import { fas, faGlobe, faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';

import { withRouter } from 'react-router-dom';
import { NotFound } from "./views/NotFound";

import { createMarkdownPage } from './components/markdown-loader'
import { prerenderedLoader } from './components/prerender-loader'

library.add(fab, faDiscord, faMedium, faGithub);
library.add(fab, fas, faGlobe, faArrowCircleDown, faDiscord, faMedium, faGithub);

const AppHeaderWithRouter = withRouter(props => <AppHeader {...props} />);
const PrivacyPolicy = prerenderedLoader(() => createMarkdownPage('/privacy-policy.md'));

export const App: React.StatelessComponent = () => {

  return (
    <BrowserRouter basename="/">
      <Stack horizontalAlign="center">
        <AppHeaderWithRouter />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/projects/" component={Projects} />
          <Route path="/launch/" component={Launch} />
          <Route path="/signin/" component={Signin} />
          <Route path="/dashboard/" component={Dashboard} />
          <Route path="/privacy-policy/" component={PrivacyPolicy} />
          <Route component={NotFound} />
        </Switch>
      </Stack>
    </BrowserRouter>
  );
};
