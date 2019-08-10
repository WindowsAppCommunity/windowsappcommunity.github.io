import React from "react";
import { hydrate, render } from "react-dom";
import { initializeIcons } from "@uifabric/icons";
import {App} from './App';

// Initializes the UI Fabric icons that we can use
// Choose one from this list: https://developer.microsoft.com/en-us/fabric#/styles/icons
initializeIcons();

const rootElement = document.getElementById("root");
if (rootElement && rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}