import React from "react";
import ReactDOM from "react-dom";
import { Projects } from "./components/Projects";
import { initializeIcons } from "@uifabric/icons";
import { Header } from "./components/Header";
import { Menu } from "./components/Menu";
import { Footer } from "./components/Footer";

// Initializes the UI Fabric icons that we can use
// Choose one from this list: https://developer.microsoft.com/en-us/fabric#/styles/icons
initializeIcons();

ReactDOM.render(<Header />, document.getElementById("header"));
ReactDOM.render(<Menu />, document.getElementById("menu"));
ReactDOM.render(<Projects />, document.getElementById("content"));
ReactDOM.render(<Footer />, document.getElementById("footer"));
