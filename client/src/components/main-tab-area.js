import React, { Component } from 'react';
import Tab from './tab';

class MainTabArea extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div className="main-tab-area">
				<Tab tabData={this.props.tabData} />
			</div>
		);
	}
}

export default MainTabArea;
