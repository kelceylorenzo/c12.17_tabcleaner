import React from "react";
import { Link } from "react-router-dom";

import "../assets/css/header.css";

export default props => {
	const navLinks = props.routes.map((item, index) => {
		return (
			<li key={index} className="nav-link">
				<Link to={item.to}>{item.name}</Link>
			</li>
		);
	});

	return (
		<div className="nav-container">
			<ul className="nav-bar">{navLinks}</ul>
		</div>
	);
};
