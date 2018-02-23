import React, { Component } from "react";
import { Route } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;

import LandingPage from "./landing-page";
import MainPage from "./main-page";
import AboutPage from "./about-page";
import StatsPage from "./stats-page";
import TopTenPage from "./top-ten-page";
import headerData from "./header-data.js";

import "../assets/css/app.css";

class App extends Component {

	render() {
		return (
			<div className="app">
				<Route exact path="/" component={LandingPage} />
				<Route path="/dashboard" component={MainPage} />
				<Route path="/about" component={AboutPage} />
				<Route path="/stats-page" component={StatsPage} />
				<Route path="/top-ten" component={TopTenPage} />
			</div>
		);
	}
}

export default App;
