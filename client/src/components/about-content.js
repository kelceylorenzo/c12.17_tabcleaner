import React from "react";
import teamPicture from "../assets/images/about-us-mainimage.png";
import "../assets/css/about.css";

export default props => {
	return (
		<div className="about-content-container container-fluid">
			<div className="row">
				<div className="col-xs-12 text-center">
					<img src={teamPicture} className="about-main-image" />
				</div>
			</div>
			<div className="row">
				<div className="col-xs-10">
					<blockquote>
						<p className="about-me-description">
							<b>DESCRIPTION OF OUR TEAM</b> We make tabs work for you.
						</p>
					</blockquote>
				</div>
			</div>
			<div className="row">
				<div className="col-xs-2 text-center">
					<p>Andrea</p>
					<p>Github | Portfolio</p>
				</div>
				<div className="col-xs-2 text-center">
					<p>Henry</p>
					<p>Github | Portfolio</p>
				</div>
				<div className="col-xs-2 text-center">
					<p>James</p>
					<p>Github | Portfolio</p>
				</div>

				<div className="col-xs-2 text-center">
					<p>Kelcey</p>
					<p>Github | Portfolio</p>
				</div>
				<div className="col-xs-2 text-center">
					<p>Nick</p>
					<p>Github | Portfolio</p>
				</div>
			</div>
		</div>
	);
};
