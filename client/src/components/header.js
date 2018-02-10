import React from 'react';
import headerData from "./header-data"

export default (props) => {
	console.log(headerData);

	const navLinks = headerData.map((item, index) => {
		return (
			<li key={index} className="navLink">
				{item.title}
			</li>
		);
	});

	return (
		<div className="nav-container">
			<ul className="navBar">{navLinks}</ul>
		</div>
	);
};
