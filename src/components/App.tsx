import * as React from "react";
import {
  Route,
  Switch,
  HashRouter
} from 'react-router-dom';
import { About } from './About';
import { Projects } from './Projects';
import { Home } from './app/Home';
//  import { NotFound } from './NotFound';
import { Header } from "./app/Header";
import { Menu } from "./app/Menu";
import { Stack } from "office-ui-fabric-react";

export const App: React.StatelessComponent = () => {
  return (
    <HashRouter basename="/">
      <Stack horizontalAlign="center">
        <Header />
        <Menu />
        <Switch>
          <Route exact path="/projects" component={Projects} />
          <Route path="/about" component={About} />
          <Route component={Home} />
        </Switch>
      </Stack>
    </HashRouter>
  );
};
