import React from 'react';

export default (props) => {
	const footerLinks = props.footerData.map((item, index) => {
		return (
			<li key={index} className="footerLink">
				{item.title}
			</li>
		);
	});

	return (
		<div className="footer-container">
			<ul className="footer-links">{footerLinks}</ul>
			<p className="copyright">&copy; Copyright Tabs Team 2018</p>
		</div>
	);
};
