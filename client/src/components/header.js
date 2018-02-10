import React from 'react';

export default (props) => {
	console.log(props.headerData);

	const navLinks = props.headerData.map((item, index) => {
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
