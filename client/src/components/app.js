import React from "react";
import { Route } from "react-router-dom";

import AboutPage from "./about-content";
import Header from "./header";
import MainPage from "./main-page";
import StatsPage from "./stats-page";
import SettingsPage from "./settings";
import TopTenPage from "./top-ten-page";

import headerData from "./header-data.js";

import "../assets/css/app.css";
import "bootstrap/dist/css/bootstrap.min.css";

const routes = [
	{
		name: "Home",
		to: "/"
	},
	{
		name: "Top Ten",
		to: "/top-ten"
	},
	{
		name: "Stats Page",
		to: "/stats-page"
	},
	{
		name: "About",
		to: "/about"
	},
	{
		name: "Settings",
		to: "/settings"
	}
];

const App = () => (
	<div className="app-container container-fluid">
		<div className="header-container row">
			<Header routes={headerData} />
		</div>
		<div className="main-app row">
			{/* <MainPage /> */}
			<Route exact path="/" component={MainPage} />
			<Route path="/about" component={AboutPage} />
			<Route path="/stats-page" component={StatsPage} />
			<Route path="/settings" component={SettingsPage} />
			<Route path="/top-ten" component={TopTenPage} />
		</div>
	</div>
);

export default App;
