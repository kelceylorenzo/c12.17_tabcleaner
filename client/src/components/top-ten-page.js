import React, { Component } from "react";
import image from "../assets/images/about-us-mainimage.png";
import Header from "./header";
import headerData from "./header-data.js";

class TopTenPage extends Component {
	render() {
		return (
			<div className="top-ten-container">
				<div className="header-container">
					<Header routes={headerData} />
				</div>
				<div className="website-container">
					<div className="page">
						<div className="website-name">Youtube</div>
						<div className="screenshot-container">
							<img className="screenshot" src={image} alt="top top screenshot" />
							{/* <div className="screenshot-overlay">here is some text</div> */}
						</div>
						<div className="time-spent">Time Spent: 120</div>
					</div>
					<div className="page">
						<div className="website-name">Youtube</div>
						<div className="screenshot" />
						<div className="time-spent">Time Spent: 120</div>
					</div>
					<div className="page">
						<div className="website-name">Youtube</div>
						<div className="screenshot" />
						<div className="time-spent">Time Spent: 120</div>
					</div>
					<div className="page">
						<div className="website-name">Youtube</div>
						<div className="screenshot" />
						<div className="time-spent">Time Spent: 120</div>
					</div>
					<div className="page">
						<div className="website-name">Youtube</div>
						<div className="screenshot" />
						<div className="time-spent">Time Spent: 120</div>
					</div>
					<div className="page">
						<div className="website-name">Youtube</div>
						<div className="screenshot" />
						<div className="time-spent">Time Spent: 120</div>
					</div>
					<div className="page">
						<div className="website-name">Youtube</div>
						<div className="screenshot" />
						<div className="time-spent">Time Spent: 120</div>
					</div>
					<div className="page">
						<div className="website-name">Youtube</div>
						<div className="screenshot" />
						<div className="time-spent">Time Spent: 120</div>
					</div>
					<div className="page">
						<div className="website-name">Youtube</div>
						<div className="screenshot" />
						<div className="time-spent">Time Spent: 120</div>
					</div>
					<div className="page">
						<div className="website-name">Youtube</div>
						<div className="screenshot" />
						<div className="time-spent">Time Spent: 120</div>
					</div>
				</div>
			</div>
		);
	}
}

export default TopTenPage;
