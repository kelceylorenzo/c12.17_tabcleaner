import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/images/app-logo.png';

export default (props) => {
	const navLinks = props.routes.map((item, index) => {
		return (
			<Link to={item.to} className="nav-link-container" id={item.id} key={index}>
				<div className="nav-link">{item.name}</div>
			</Link>
		);
	});

	function clearData() {
		axios
			.delete('/tabs/google')
			.then((resp) => {
				console.log('clearData Success Response: ', resp);
			})
			.catch((err) => {
				console.log('clearData Error Response: ', err);
			});
	}

	return (
		<div className="header">
			<Link className="logo-container" to="/dashboard">
				<img className="header-logo" src={logo} alt="" />
			</Link>

			<div className="navigation-container">
				<div className="navigation">
					{navLinks}
					<a
						className="nav-link-container"
						id="log-out-button"
						href="/auth/google/logout"
						onClick={clearData}
					>
						<div className="nav-link">
							<div className="log-out-link">LOG OUT</div>
						</div>
					</a>
				</div>
			</div>
		</div>
	);
};
