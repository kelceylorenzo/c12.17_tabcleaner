import React from "react";
import FooterData from "./footer-data";

export default props => {
	const footerLinks = FooterData.map((item, index) => {
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
