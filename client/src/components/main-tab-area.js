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
				<div className="main-toolbar-container">
					<div className="tab-view-menu">
						<div className="tab-view-option">
							<i className="fas fa-th-large" />
						</div>
						<div className="tab-view-option">
							<i className="fas fa-list-ul" />
						</div>
						<div className="tab-view-option">
							<i className="fas fa-sync-alt" />
						</div>
					</div>
					<Sort sort={(sortType) => this.props.sort(sortType)} sortType={this.props.sortType} />
				</div>
				<div className="tab-window">{tabList}</div>
			</div>
		);
	}
}

export default MainTabArea;
