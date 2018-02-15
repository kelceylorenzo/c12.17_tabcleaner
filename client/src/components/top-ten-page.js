import React, { Component } from "react";

import Header from "./header";
import headerData from "./header-data.js";

import "../assets/css/top-ten-page.css";

class TopTenPage extends Component {
	render() {
		return (
			<div>
				<div>
					<Header routes={headerData} />
				</div>
				<div className="top-ten-container">
					<div className="header">
						<h1>Top 10 Websites You Visit</h1>
					</div>

					<div className="website-container">
						<div className="page">
							<div className="website-name">Youtube</div>
							<div className="screenshot" />
							<div className="time-spent">120</div>
						</div>
						<div className="page">
							<div className="website-name">Youtube</div>
							<div className="screenshot" />
							<div className="time-spent">120</div>
						</div>
						<div className="page">
							<div className="website-name">Youtube</div>
							<div className="screenshot" />
							<div className="time-spent">120</div>
						</div>
						<div className="page">
							<div className="website-name">Youtube</div>
							<div className="screenshot" />
							<div className="time-spent">120</div>
						</div>
						<div className="page">
							<div className="website-name">Youtube</div>
							<div className="screenshot" />
							<div className="time-spent">120</div>
						</div>
						<div className="page">
							<div className="website-name">Youtube</div>
							<div className="screenshot" />
							<div className="time-spent">120</div>
						</div>
						<div className="page">
							<div className="website-name">Youtube</div>
							<div className="screenshot" />
							<div className="time-spent">120</div>
						</div>
						<div className="page">
							<div className="website-name">Youtube</div>
							<div className="screenshot" />
							<div className="time-spent">120</div>
						</div>
						<div className="page">
							<div className="website-name">Youtube</div>
							<div className="screenshot" />
							<div className="time-spent">120</div>
						</div>
						<div className="page">
							<div className="website-name">Youtube</div>
							<div className="screenshot" />
							<div className="time-spent">120</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default TopTenPage;
