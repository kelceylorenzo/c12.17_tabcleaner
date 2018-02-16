import React from "react";
import { Link } from "react-router-dom";

export default props => {
	return (
		<div className="landing-page-container">
			<div className="landing-page-title">
				<h1>Close Your Tabs</h1>
			</div>

			<div className="login-button-container">
				<Link className="login-button" to="/dashboard">
					LOG IN
				</Link>
			</div>
		</div>
	);
};
