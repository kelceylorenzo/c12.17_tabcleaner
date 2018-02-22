import React, { Component } from "react";
import axios from "axios";

import Tab from "./tab";
import Sort from "./main-sort";

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
				<div className="main-toolbar-container">
					<div className="tab-view-menu">
						<div onClick={this.props.handleViewChange} className="tab-view-option">
							<i className="grid-view-button fas fa-th-large" />
						</div>
						<div onClick={this.props.handleViewChange} className="tab-view-option">
							<i className="list-view-button fas fa-list-ul" />
						</div>
						<div onClick={this.props.handleRefresh} className="tab-view-option">
							<i className="refresh-button fas fa-sync-alt" />
						</div>
					</div>
					<Sort sort={sortType => this.props.sort(sortType)} sortType={this.props.sortType} />
				</div>
				<div className="tab-window">{tabList}</div>
			</div>
		);
	}
}

export default MainTabArea;
