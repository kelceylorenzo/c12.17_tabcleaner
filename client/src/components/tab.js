import React from "react";

import Data from "../assets/data/data";

export default props => {
	const tabData = Data.map((item, index) => {
		return (
			<p className="tabURL" key={index}>
				{item.url}
			</p>
		);
	});
	return <div className="tab-container">{tabData}</div>;
};
