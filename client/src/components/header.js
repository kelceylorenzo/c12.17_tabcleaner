import React from "react";
import { Link } from "react-router-dom";


export default props => {
	const navLinks = props.routes.map((item, index) => {
		return (
			<li key={index}>
				<Link to={item.to}>{item.name}</Link>
			</li>
		);
	});

	return (
		<div>
			<ul>{navLinks}</ul>
		</div>
	);
};
