import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;

import LandingPage from './landing-page';
import MainPage from './main-page';
import AboutPage from './about-page';
import TopTenPage from './top-ten-page';
import headerData from './header-data.js';

import '../assets/css/app.css';
  
class App extends Component {
	render() {\
		return (
			<div className="app">
				<Switch>
					<Route exact path="/" component={LandingPage} />
					<Route path="/dashboard" component={MainPage} />
					<Route path="/about" component={AboutPage} />
					<Route path="/top-ten" component={TopTenPage} />
					<Redirect to="/" />
				</Switch>
			</div>
		);
	}
}

export default App;
