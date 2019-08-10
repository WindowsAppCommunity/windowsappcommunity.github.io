import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { PrimaryButton } from 'office-ui-fabric-react';

export class Menu extends React.Component<any, any> {
  public render(): JSX.Element {
    return (
      <nav>
        <NavLink to="/" exact activeClassName="selected" style={{marginRight:10}}>
          <PrimaryButton text="Home" />
        </NavLink>
        <NavLink to="/projects" activeClassName="selected" /* activeStyle= */>
          <PrimaryButton text="Projects" />
        </NavLink>
      </nav>
    );
  }
}