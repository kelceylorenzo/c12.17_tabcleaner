import React from 'react';
import { Link } from 'react-router-dom';

export default (props) => {
	const navLinks = props.routes.map((item, index) => {
		return (
			<li className="nav-links" key={index}>
				<Link to={item.to}>{item.name}</Link>
			</li>
		);
	});

	return (
		<div className="header">
			<div className="navigation-container">
				<ul className="navigation">{navLinks}</ul>
			</div>
		</div>
	);
};
