import React, { Component } from "react";
import { Route } from "react-router-dom";
import axios from "axios";

import LandingPage from "./landing-page";
import MainPage from "./main-page";
import AboutPage from "./about-page";
import StatsPage from "./stats-page";
import TopTenPage from "./top-ten-page";
import headerData from "./header-data.js";

import "../assets/css/app.css";

class App extends Component {
	verifyLogIn() {
		axios.get(`/auth/google/verify`).then(resp => {
			console.log("Verify response: ", resp);
			if (resp.data) {
				console.log("TRUE");
				console.log("this.props: ", this.props);
				console.log("Response: ", resp);
				// this.props.history.push("/dashboard");
			} else {
				console.log("FALSE");
				// this.props.history.push("/");
			}
		});
	}

	componentDidMount() {
		this.verifyLogIn();
	}

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

// const App = () => (
// 	<div className="app">
// 		<Route exact path="/" component={LandingPage} />
// 		<Route path="/dashboard" component={MainPage} />
// 		<Route path="/about" component={AboutPage} />
// 		<Route path="/stats-page" component={StatsPage} />
// 		<Route path="/top-ten" component={TopTenPage} />
// 	</div>
// );

export default App;
