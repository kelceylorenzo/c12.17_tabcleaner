import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import AboutPage from './about-page';
import Header from './header';
import StatsPage from './stats-page';
import SettingsPage from './settings';
import TopTenPage from './top-ten-page';
import MainSidebar from './main-sidebar';
import MainTabArea from './main-tab-area';

import headerData from './header-data.js';
import data from '../assets/data/data';
import tab from './tab';

// import "../assets/css/main-page.css";

class MainPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tabsList: [],
			selectedTabs: [],
			sortType: 'Default'
		};

		this.handleIndividualSelect = this.handleIndividualSelect.bind(this);
		this.selectAll = this.selectAll.bind(this);
		this.deselectAll = this.deselectAll.bind(this);
		this.openTab = this.openTab.bind(this);
		this.closeTab = this.closeTab.bind(this);
		this.handleSort = this.handleSort.bind(this);
	}

	componentDidMount() {
		//remove data parameter when adjusting code for axios calls
		this.getData(data);
	}

	//adjust getData code when ready to make axios/database calls (removing resp parameter and adding axios call
	getData(resp) {
		resp.map((currentItem) => {
			return (currentItem.selected = false);
		});

		this.setState({
			...this.state,
			tabsList: resp
		});
	}

	handleIndividualSelect(item) {
		let { tabsList, selectedTabs } = this.state;

		if (!item.selected) {
			selectedTabs.push(item);
			tabsList[tabsList.indexOf(item)].selected = true;
		} else {
			selectedTabs.splice(selectedTabs.indexOf(item), 1);
			tabsList[tabsList.indexOf(item)].selected = false;
		}

		this.setState({
			...this.state,
			tabsList: tabsList,
			selectedTabs: selectedTabs
		});
	}

	handleSort(event) {
		let { tabsList } = this.state;

		const sortType = event.target.getAttribute('data-sorttype');

		switch (sortType) {
			case 'A-Z':
				tabsList.sort((a, b) => {
					let titleA = a.title;
					let titleB = b.title;

					if (titleA < titleB) {
						return -1;
					}
					if (titleA > titleB) {
						return 1;
					}
					return 0;
				});
				break;
			case 'Z-A':
				tabsList.sort((a, b) => {
					let titleA = a.title;
					let titleB = b.title;

					if (titleA > titleB) {
						return -1;
					}
					if (titleA < titleB) {
						return 1;
					}
					return 0;
				});
				break;
			case 'Time':
				//currently sorted from oldest >>> newest in terms of activationTime
				//glitches out sometimes
				tabsList.sort((a, b) => {
					let timeA = a.timeofActivation;
					let timeB = b.timeofActivation;

					if (timeA > timeB) {
						return -1;
					}
					if (timeA < timeB) {
						return 1;
					}
					return 0;
				});
				break;
			case 'Window':
				let output = {};
				for (let i = 0; i < tabsList.length; i++) {
					if (output[tabsList[i].windowId]) {
						output[tabsList[i].windowId].push(tabsList[i]);
					} else {
						output[tabsList[i].windowId] = [];
						output[tabsList[i].windowId].push(tabsList[i]);
					}
				}

				tabsList = [];

				for (let x in output) {
					output[x].sort((a, b) => {
						let indexA = a.index + a.windowId;
						let indexB = b.index + b.windowId;

						if (indexA < indexB) {
							return -1;
						}
						if (indexA > indexB) {
							return 1;
						}
						return 0;
					});

					for (let flatten = 0; flatten < output[x].length; flatten++) {
						tabsList.push(output[x][flatten]);
					}
				}
		}

		this.setState({
			...this.state,
			tabsList: tabsList,
			sortType: sortType
		});
	}

	openTab() {
		let { selectedTabs } = this.state;

		for (let tab of selectedTabs) {
			let newTab = window.open(tab.url, '_blank');
			newTab.focus();
		}
	}

	closeTab() {
		let { selectedTabs, tabsList } = this.state;
		let selectedIDs = [];

		for (let tab of selectedTabs) {
			selectedIDs.push(tab.id);
		}

		tabsList = tabsList.filter(function(tab) {
			if (selectedIDs.indexOf(tab.id) === -1) {
				return true;
			}
			return false;
		});
		this.setState({
			tabsList: tabsList
		});
	}

	selectAll() {
		let { tabsList, selectedTabs } = this.state;

		selectedTabs = [];

		tabsList.map((index) => {
			index.selected = true;
			selectedTabs.push(index);
		});

		this.setState({
			...this.state,
			tabsList: tabsList,
			selectedTabs: selectedTabs
		});
	}

	deselectAll() {
		let { tabsList, selectedTabs } = this.state;

		selectedTabs = [];

		tabsList.map((index) => {
			index.selected = false;
		});

		this.setState({
			...this.state,
			tabsList: tabsList,
			selectedTabs: selectedTabs
		});
	}

	render() {
		console.log('sort type: ', this.state.sortType);
		return (
			<div>
				<div className="header-container">
					<Header routes={headerData} />
				</div>
				<div>
					<div>
						<MainSidebar
							closeTab={this.closeTab}
							openTab={this.openTab}
							selectAll={this.selectAll}
							deselectAll={this.deselectAll}
							sort={this.handleSort}
						/>
						<MainTabArea
							sortType={this.state.sortType}
							tabData={this.state.tabsList}
							select={this.handleIndividualSelect}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default MainPage;
