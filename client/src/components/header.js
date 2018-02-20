import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/app-logo.png';

export default (props) => {
	const navLinks = props.routes.map((item, index) => {
		return (
			<Link to={item.to} className="nav-link-container" id={item.id} key={index}>
				<div className="nav-link">{item.name}</div>
			</Link>
		);
	});

	return (
		<div className="header">
			<Link className="logo-container" to="/dashboard">
				<img className="header-logo" src={logo} alt="" />
			</Link>

			<div className="navigation-container">
				<div className="navigation">{navLinks}</div>
			</div>
		</div>
	);
};
