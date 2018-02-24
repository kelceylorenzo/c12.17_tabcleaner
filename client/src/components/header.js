import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/app-logo.png";

export default props => {
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
				<div className="navigation">
					{navLinks}
					<div className="nav-link-container" id="log-out-button"
					//  onClick={props.logOut}
					 >
						<div className="nav-link">
							<a className="log-out-link"href="/auth/google/logout">LOG OUT</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
