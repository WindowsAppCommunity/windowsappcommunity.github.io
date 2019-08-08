import * as React from "react";
import {
  Route,
  Switch,
  HashRouter} from 'react-router-dom';
import { About } from './About';
import { Projects } from './Projects';
//  import { NotFound } from './NotFound';
import { Header } from "./app/Header";
import { Menu } from "./app/Menu";
import { Footer } from "./app/Footer";

export const App: React.StatelessComponent = () => {
  return (
    <HashRouter basename="/">
      <Header />
      {/* <Menu /> */}
      <Switch>
        <Route exact path="/" component={Projects} />
        <Route path="/about" component={About} />
        <Route component={Projects} />
      </Switch>
      <Footer />
    </HashRouter>
  );
};
