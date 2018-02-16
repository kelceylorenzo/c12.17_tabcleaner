import React from 'react';
import { Route } from 'react-router-dom';

import LandingPage from './landing-page';
import MainPage from './main-page';
import AboutPage from './about-page';
import Header from './header';
import StatsPage from './stats-page';
import TopTenPage from './top-ten-page';
import headerData from './header-data.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/app.css';

const routes = [
	{
		name: 'Home',
		to: '/dashboard'
	},
	{
		name: 'Top Ten',
		to: '/top-ten'
	},
	{
		name: 'Stats Page',
		to: '/stats-page'
	},
	{
		name: 'About',
		to: '/about'
	}
];

const App = () => (
	<div className="app">
		<Route exact path="/" component={LandingPage} />
		<Route path="/dashboard" component={MainPage} />
		<Route path="/about" component={AboutPage} />
		<Route path="/stats-page" component={StatsPage} />
		<Route path="/top-ten" component={TopTenPage} />
	</div>
);

export default App;
