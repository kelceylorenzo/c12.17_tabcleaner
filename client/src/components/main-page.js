import React, { Component } from 'react';

import MainSidebar from './main-sidebar';
import MainTabArea from './main-tab-area';

import data from '../assets/data/data';
import tab from './tab';

import '../assets/css/main-page.css';

class MainPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tabsList: [],
			selectedTabs: []
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
		const { tabsList } = this.state;
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
				//currently sorted by tab index but not taking into account separating tabs based on window ID
				tabsList.sort((a, b) => {
					let indexA = a.index;
					let indexB = b.index;

					if (indexA < indexB) {
						return -1;
					}
					if (indexA > indexB) {
						return 1;
					}
					return 0;
				});
				break;
		}

		this.setState({
			...this.state,
			tabsList: tabsList
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
		console.log(this.state.tabsList);
		return (
			<div className="main-page-container">
				<MainSidebar
					closeTab={this.closeTab}
					openTab={this.openTab}
					selectAll={this.selectAll}
					deselectAll={this.deselectAll}
					sort={this.handleSort}
				/>
				<MainTabArea tabData={this.state.tabsList} select={this.handleIndividualSelect} />
			</div>
		);
	}
}

export default MainPage;
