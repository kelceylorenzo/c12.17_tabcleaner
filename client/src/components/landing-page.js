import React from 'react';
import { Link } from 'react-router-dom';
import image from '../assets/images/app-logo.png';

export default (props) => {
	return (
		<div className="landing-page-container">
			<img className="logo" src={image} alt="" />
			<div className="landing-page-title">
				<h1>CLOSE YOUR TABS</h1>
			</div>

			<div className="login-button-container">
				<Link className="login-button" to="/auth/google">
					LOG IN
				</a>
			</div>
		</div>
	);
};
