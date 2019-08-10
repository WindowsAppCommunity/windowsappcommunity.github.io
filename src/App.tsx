import * as React from "react";
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import { Projects } from './views/Projects';
import { Home } from './views/Home';
import { AppHeader } from "./components/AppHeader";

import { Stack } from "office-ui-fabric-react";

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab, faDiscord, faMedium, faGithub } from '@fortawesome/free-brands-svg-icons'

library.add(fab, faDiscord, faMedium, faGithub);

export const App: React.StatelessComponent = () => {
  return (
    <BrowserRouter basename="/">
      <Stack horizontalAlign="center">
        <AppHeader />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/projects" component={Projects} />
          <Route component={Home} />}
        </Switch>
      </Stack>
    </BrowserRouter>
  );
};
