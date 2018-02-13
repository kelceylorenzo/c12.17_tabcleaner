import React from "react";
import { Route, Link } from "react-router-dom";
import "../assets/css/landing-page.css";

import SignUpPage from "./sign-up-page";

export default props => {
	return (
		<div className="container">
			<div className="landing-page-container">
				<div className="landing-page">
					<div className="row text-center">
						<h1>APPLICATION NAME</h1>
						<h6>Some text about what our application does</h6>
					</div>

					<div className="button-container">
						<div className="row">
							<Link to="/sign-up">
								<button className="button btn-default btn bt-lg"> SIGN UP </button>
							</Link>
						</div>
						<div className="row">
							<button className="button btn-default btn bt-lg"> LOG IN </button>
						</div>
					</div>
				</div>
			</div>
			
		</div>
	);
};
