import React from 'react';
import PasswordChange from './password-change';
import EmailChange from './email-change';
import '../assets/css/settings.css';

export default () => {
	return (
		<div className="settings-container">
			<h2 className="center-align">Settings Page</h2>
			<div className="row">
				<button>BACK</button>
			</div>
			<div className="row">
				<PasswordChange />
				<EmailChange />
			</div>
		</div>
	);
};
