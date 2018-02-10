import React from 'react';

export default (props) => {
	const tabData = props.tabData.map((item, index) => {
		return (
			<p className="tabURL" key={index}>
				{item.url}
			</p>
		);
	});
	return <div className="tab-container">{tabData}</div>;
};
