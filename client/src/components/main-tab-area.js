import React, { Component } from "react";
import Tab from "./tab";

class MainTabArea extends Component {
	render() {
		const tabList = this.props.tabData.map((item, index) => {
			return <Tab key={index} item={item} select={() => this.props.select(item)} />;
		});

		return (
			<div className="main-tab-area">
				<h3 className="main-tab-area-title">Sorted by: {this.props.sortType}</h3>
				<div className="tab-window">{tabList}</div>
			</div>
		);
	}
}

export default MainTabArea;
