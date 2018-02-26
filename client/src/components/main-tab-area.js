import React, { Component } from 'react';
import axios from 'axios';

import Tab from './tab';
import Sort from './main-sort';

class MainTabArea extends Component {
	render() {
		let tabList;

		if (this.props.tabData) {
			tabList = this.props.tabData.map((item, index) => {
				return (
					<Tab
						key={index}
						item={item}
						select={() => this.props.select(item)}
						utilityClick={(item, selected) => this.props.utilityClick(item, selected)}
						viewChange={this.props.viewChange}
					/>
				);
			});
		} else {
			tabList = (
				<div className="no-tab-data">
					<i className="no-data-exclamation fas fa-exclamation-circle" />
					<p className="no-tab-data-title">NO TABS HERE!</p>
					<p className="no-tab-data-subtitle">Please try again later</p>
				</div>
			);
		}

		let windowView = {
			view: 'tab-window'
		};

		if (this.props.viewChange === 'grid') {
			windowView.view = 'tab-window';
		} else {
			windowView.view = 'list-tab-window';
		}

		return (
			<div className="main-tab-area">
				<div className="main-toolbar-container">
					<div className="tab-view-menu">
						<div onClick={() => this.props.handleViewChange('grid')} className="tab-view-option">
							<i className="grid-view-button fas fa-th-large" />
						</div>
						<div onClick={() => this.props.handleViewChange('list')} className="tab-view-option">
							<i className="list-view-button fas fa-list-ul" />
						</div>
						<div onClick={this.props.handleRefresh} className="tab-view-option">
							<i className="refresh-button fas fa-sync-alt" />
						</div>
					</div>
					<Sort sort={(sortType) => this.props.sort(sortType)} sortType={this.props.sortType} />
				</div>
				<div className="tab-window" className={windowView.view}>
					{tabList}
				</div>
			</div>
		);
	}
}

export default MainTabArea;
