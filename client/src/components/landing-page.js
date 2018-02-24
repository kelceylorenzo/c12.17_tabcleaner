import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import image from '../assets/images/app-logo.png';
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
			<div className="landing-page-container">
				<img className="logo" src={image} alt="" />
				<div className="landing-page-title">
					<h1>CLOSE YOUR TABS</h1>
				</div>

				<div className="login-button-container">
					<a className="login-button" href="/auth/google/">
						LOG IN
					</a>
				</div>
			</div>
		);
	}
}

export default LandingPage;
