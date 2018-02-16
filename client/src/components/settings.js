
import React from 'react';
import PasswordChange from './password-change';
import EmailChange from './email-change';


export default () => {
	return (
		<div className="container">
			<div className="settings-container">
				<h2 className="text-center">Settings Page</h2>
				<div className="row">
					<button>BACK</button>
				</div>
				<div className="row">
					<PasswordChange />
					<EmailChange />
				</div>
			</div>
		</div>
	);
};
