import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';

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

class MainPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tabsList: [],
			selectedTabs: [],
			sortType: 'window',
			viewChange: 'grid'
		};

		this.handleIndividualSelect = this.handleIndividualSelect.bind(this);
		this.handleUtilityClick = this.handleUtilityClick.bind(this);
		this.selectAll = this.selectAll.bind(this);
		this.deselectAll = this.deselectAll.bind(this);
		this.openSingleTab = this.openSingleTab.bind(this);
		this.openSelectedTabs = this.openSelectedTabs.bind(this);
		this.closeSelectedTabs = this.closeSelectedTabs.bind(this);
		this.handleSort = this.handleSort.bind(this);
		this.handleViewChange = this.handleViewChange.bind(this);
		this.handleRefresh = this.handleRefresh.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

	getData() {
		axios.get('/tabs').then((resp) => {
			console.log('GET response for /tabs: ', resp.data);
			console.log('Resp.data.data: ', resp.data.data);
			resp.data.data.map((currentItem) => {
				return (currentItem.selected = false);
			});
			this.setState(
				{
					...this.state,
					tabsList: resp.data.data
				},
				() => this.handleSort(this.state.sortType)
			);
		});
	}

	handleRefresh() {
		this.getData();
	}

	handleViewChange(view) {
		this.setState({
			viewChange: view
		});
		console.log('Handle view button clicked: ', view);
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

	handleSort(sortType) {
		let { tabsList } = this.state;

		switch (sortType) {
			case 'az':
				tabsList.sort((a, b) => {
					let titleA = a.tabTitle;
					let titleB = b.tabTitle;

					if (titleA < titleB) {
						return -1;
					}
					if (titleA > titleB) {
						return 1;
					}
					return 0;
				});
				break;
			case 'za':
				tabsList.sort((a, b) => {
					let titleA = a.tabTitle;
					let titleB = b.tabTitle;

					if (titleA > titleB) {
						return -1;
					}
					if (titleA < titleB) {
						return 1;
					}
					return 0;
				});
				break;

			case 'time':
				tabsList.sort((a, b) => {
					let timeA = a.currentTime - a.deactivatedTime;
					let timeB = b.currentTime - b.deactivatedTime;

					if (timeA > timeB) {
						return -1;
					}
					if (timeA < timeB) {
						return 1;
					}
					return 0;
				});
				break;
			case 'window':
				let output = {};
				for (let i = 0; i < tabsList.length; i++) {
					if (output[tabsList[i].windowID]) {
						output[tabsList[i].windowID].push(tabsList[i]);
					} else {
						output[tabsList[i].windowID] = [];
						output[tabsList[i].windowID].push(tabsList[i]);
					}
				}

				tabsList = [];

				for (let x in output) {
					output[x].sort((a, b) => {
						let indexA = a.browserTabIndex;
						let indexB = b.browserTabIndex;

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

	openSelectedTabs() {
		let { selectedTabs } = this.state;

		for (let tab of selectedTabs) {
			let newTab = window.open(tab.url, '_blank');
			newTab.focus();
		}
		this.deselectAll();
	}

	closeSelectedTabs() {
		let { selectedTabs, tabsList } = this.state;
		let selectedIDs = [];

		for (let tab of selectedTabs) {
			selectedIDs.push(tab.databaseTabID);
		}

<<<<<<< HEAD
		// for (let currentTabIndex = 0; currentTabIndex < selectedTabs.length; currentTabIndex++) {
		// 	let tabToDelete = {};
		// 	tabToDelete['databaseTabID'] = selectedIDs[currentTabIndex];
		// 	console.log('tabToDelete: ', tabToDelete);
		// 	axios.delete('/tabs/database', tabToDelete).then((resp) => {
		// 		if (resp.data.success) {
		// 			console.log('Tab was deleted', resp);
		// 			tabsList = tabsList.splice([tabsList.indexOf(selectedTabs[currentTabIndex])], 1);
		// 		} else {
		// 			console.log('Server Error; Tab was not deleted ', resp);
		// 			return;
		// 		}
		// 	});
		// }

		tabsList = tabsList.filter(function(tab) {
			if (selectedIDs.indexOf(tab.databaseTabID) === -1) {
				return true;
			}
			return false;
		});
=======
		for (let currentTabIndex = 0; currentTabIndex < selectedTabs.length; currentTabIndex++) {
			axios.delete('/tabs/database', selectedIDs[currentTabIndex]).then((resp) => {
				if (resp.data.success) {
					console.log('Tab was deleted', resp);
					tabsList = tabsList.splice([tabsList.indexOf(selectedTabs[currentTabIndex])], 1);
				} else {
					console.log('Server Error; Tab was not deleted ', resp);
					return;
				}
			});
		}
>>>>>>> bb6a851ebbddaa3e74652a0680fd1940e537ae95

		this.setState({
			tabsList: tabsList
		});
	}

	handleUtilityClick(item, selectedType) {
		switch (selectedType) {
			case 'open':
				item.selected = false;
				this.handleIndividualSelect(item);
				this.openSingleTab(item);
				break;
			case 'close':
				this.closeSingleTab(item);
				break;
			default:
				return;
		}
	}

	openSingleTab(item) {
		let newTab = window.open(item.url, '_blank');
		newTab.focus();
	}

	closeSingleTab(item) {
		let { tabsList } = this.state;
		tabsList.splice(tabsList.indexOf(item), 1);

		this.setState({
			...this.state,
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
		console.log('state of viewChange', this.state.viewChange);
		return (
			<div className="main-page-container">
				<div className="dashboard-container">
					<div className="header-container">
						<Header routes={headerData} logOut={this.logOut} />
					</div>
					<div className="dashboard">
						<MainSidebar
							closeTab={this.closeSelectedTabs}
							openTab={this.openSelectedTabs}
							selectAll={this.selectAll}
							deselectAll={this.deselectAll}
						/>
						<MainTabArea
							select={this.handleIndividualSelect}
							sort={(sortType) => this.handleSort(sortType)}
							sortType={this.state.sortType}
							tabData={this.state.tabsList}
							utilityClick={this.handleUtilityClick}
							handleViewChange={this.handleViewChange}
							viewChange={this.state.viewChange}
							selectChange={this.state.selectChange}
							handleRefresh={this.handleRefresh}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default MainPage;
