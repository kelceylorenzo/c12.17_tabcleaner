import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import image from '../assets/images/app-logo.png';
import placeholder from '../assets/images/e9492f0f82721e4998b1360e409e6fe8affc30bb.png';
import axios from 'axios';

class LandingPage extends Component {
	verifyLogIn() {
		axios.get(`/auth/google/verify`).then((resp) => {
			console.log('Verify response: ', resp);
			if (resp.data) {
				console.log('this.props for verify: ', this.props);
				console.log('Axios Response object: ', resp);
				this.props.history.push('/dashboard');
			} else {
				console.log('Not logged in');
				this.props.history.push('/');
			}
		});
	}

	componentDidMount() {
		this.verifyLogIn();
	}

	render() {
		return (
			<div className="home-page-container">
				<div className="home-showcase-container">
					<div className="home-showcase">
						<i className="fas fa-circle" />
					</div>
					<div className="home-showcase">
						<i className="fas fa-circle" />
					</div>
					<div className="home-showcase">
						<i className="fas fa-circle" />
					</div>
					<div className="home-showcase">
						<i className="fas fa-circle" />
					</div>
				</div>
				<div className="landing-page-container">
					<div className="landing-page-title-container">
						<img className="logo" src={image} alt="" />{' '}
						<p className="landing-page-title">CLOSE YOUR TABS</p>
						<p className="landing-page-subtitle">Keep tabs on your tabs</p>
					</div>

					<div className="login-button-container">
						<a className="login-button" href="/auth/google/">
							LOG IN
						</a>
						<a className="login-button" href="/auth/google/">
							SIGN UP
						</a>
					</div>
				</div>
				<div className="next-section-button intro">
					<p>What is Close Your Tabs?</p>
				</div>

				<div className="introduction-container">
					<div className="introduction-image">
						<img src={placeholder} alt="" />
					</div>
					<div className="introduction-content-container">
						<p className="landing-page-subtitle">Isn’t it time to close some of those tabs?</p>
						<p className="landing-page-content">
							It's simple. Using our Chrome Extension and Dashboard, Close Your Tabs keeps track of
							the last time you've visited each of your currently open browser tabs across all open
							windows and color-codes them accordingly.
						</p>
					</div>
				</div>
				<div className="next-section-button extension-dashboard">
					<p>Extension & Dashboard</p>
				</div>

				<div className="extension-dashboard-container">
					<p className="landing-page-subtitle extension-dashboard">Two ways to Close Your Tabs</p>
					<div className="extension-dashboard-content">
						<div className="extension-content">
							<p className="landing-page-content">
								Use the extension and its popup window for quick access to your tabs and their
								current statuses.
							</p>
							<img src={placeholder} alt="" />
						</div>
						<div className="dashboard-content">
							<p className="landing-page-content">
								Use the dashboard, accessible through our web portal, for more in depth details
								about your tabs and the ability to open or close multiple tabs with a few simple
								clicks.
							</p>
							<img src={placeholder} alt="" />
						</div>
					</div>
				</div>
				<div className="next-section-button getting-started">
					<p>Getting Started</p>
				</div>
				<div className="getting-started-container">
					<div className="landing-page-title-container">
						<p className="landing-page-subtitle">Let's Get Started</p>
						<p className="landing-page-content">
							Download the extension, log in, and keep tabs on your tabs.
						</p>
					</div>
					<div className="getting-started-button-container">
						<a className="getting-started-button" href="">
							GET THE EXTENSION
						</a>
						<a className="getting-started-button" href="/auth/google/">
							SIGN UP
						</a>
						<a className="getting-started-button" href="/auth/google/">
							LOG IN
						</a>
					</div>
				</div>
				<div className="next-section-button faq-link">
					<p>Still have question? Visit our FAQ.</p>
				</div>
			</div>
		);
	}
}

export default LandingPage;
