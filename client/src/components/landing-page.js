import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/landing-page.css";

import SignUpPage from "./sign-up-page";

export default props => {
	return (
		<div className="container">
			<div className="landing-page-container">
				<div className="landing-page">
					<div className="row text-center">
						<h1>Close Your Tabs</h1>
					</div>
					<div className="button-container">
						<div className="row">
							<Link to="/dashboard" className="button btn-default btn bt-lg">
								LOG IN
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
