import React, { Component } from 'react';
import Tab from './tab';

class MainTabArea extends Component {
	render() {
		const tabList = this.props.tabData.map((item, index) => {
			return <Tab key={index} item={item} select={() => this.props.select(item)} />;
		});

		return (
			<div>
				<h3>Sorted by: {this.props.sortType}</h3>
				<div>{tabList}</div>
			</div>
		);
	}
}

export default MainTabArea;
