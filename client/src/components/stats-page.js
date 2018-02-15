import React from "react";
import Header from "./header";
import headerData from "./header-data";

import "../assets/css/stats-page.css";

export default props => {
	return (
		<div>
			<div>
				<Header routes={headerData} />
			</div>
			<div className="container-fluid">
				<div className="stats-page-container">
					<div className="stats-page-header">
						<h1>Stats Page</h1>
					</div>
					<div className="stats-container">
						<div className="stats">
							<span>You've spent 100 hours on YouTube</span>
						</div>
						<div className="stats">
							<span>You've spent 200 hours on Reddit</span>
						</div>
						<div className="stats">
							<span>You've spent 180 hours on Facebook</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
