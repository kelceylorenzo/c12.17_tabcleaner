import React, { Component } from 'react';
import Tab from './tab';
import Sort from './main-sort';

class MainTabArea extends Component {
	render() {
		const tabList = this.props.tabData.map((item, index) => {
			return (
				<Tab
					key={index}
					item={item}
					select={() => this.props.select(item)}
					utilityClick={(item, selected) => this.props.utilityClick(item, selected)}
				/>
			);
		});

		return (
			<div className="main-tab-area">
				{/* <h3 className="main-tab-area-title">Sorted by: {this.props.sortType}</h3> */}
				<div className="sort-by-container">
					<Sort sort={this.props.sort} />
				</div>
				<div className="tab-window">{tabList}</div>
			</div>
		);
	}
}

export default MainTabArea;
