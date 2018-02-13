import React, { Component } from "react";
import Tab from "./tab";

class MainTabArea extends Component {
	render() {
		const tabList = this.props.tabData.map((item, index) => {
			return <Tab key={index} item={item} select={() => this.props.select(item)} />;
		});

		return <div className="main-tab-area col-xs-10">{tabList}</div>;
	}
}

export default MainTabArea;
