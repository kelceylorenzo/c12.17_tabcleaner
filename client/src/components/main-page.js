import React, { Component } from "react";
import { Route } from "react-router-dom";
import axios from "axios";

import AboutPage from "./about-page";
import Header from "./header";
import StatsPage from "./stats-page";
import SettingsPage from "./settings";
import TopTenPage from "./top-ten-page";
import MainSidebar from "./main-sidebar";
import MainTabArea from "./main-tab-area";

import headerData from "./header-data.js";
import data from "../assets/data/data";
import tab from "./tab";

class MainPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tabsList: [],
			selectedTabs: [],
			sortType: "window",
			viewChange: "grid"
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
		this.logOut = this.logOut.bind(this);
	}

	componentDidMount() {
		// this.getData(data);
		this.getData();
	}

	// getData() {
	// 	data.map(currentItem => {
	// 		return (currentItem.selected = false);
	// 	});
	// 	this.setState({ ...this.state, tabsList: data }, () => this.handleSort(this.state.sortType));
	// }

	getData() {
		axios.get("/tabs").then(resp => {
			console.log("GET response for /tabs: ", resp.data);
			console.log("Resp.data.data: ", resp.data.data);
			resp.data.data.map(currentItem => {
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

	async logOut() {
		await axios.get("auth/google/logout");
		console.log("you are logged out");
	}

	handleRefresh() {
		this.getData();
	}

	handleViewChange(view) {
		this.setState({
			viewChange:view
		})
		console.log("Handle view button clicked: ", view);
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
			case "az":
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
			case "za":
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
			case "time":
				//currently sorted from oldest >>> newest in terms of activationTime
				//glitches out sometimes
				tabsList.sort((a, b) => {
					let timeA = a.activatedTime;
					let timeB = b.activatedTime;

					if (timeA > timeB) {
						return -1;
					}
					if (timeA < timeB) {
						return 1;
					}
					return 0;
				});
				break;
			case "window":
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
			let newTab = window.open(tab.url, "_blank");
			newTab.focus();
		}
		this.deselectAll();
	}

	closeSelectedTabs() {
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

	handleUtilityClick(item, selected) {
		item.selected = false;
		this.handleIndividualSelect(item);

		switch (selected) {
			case "open":
				this.openSingleTab(item);
			case "close":
				this.closeSingleTab(item);
			default:
				return;
		}
	}

	openSingleTab(item) {
		let newTab = window.open(item.url, "_blank");
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

		tabsList.map(index => {
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

		tabsList.map(index => {
			index.selected = false;
		});

		this.setState({
			...this.state,
			tabsList: tabsList,
			selectedTabs: selectedTabs
		});
	}

	render() {
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
							sort={sortType => this.handleSort(sortType)}
							sortType={this.state.sortType}
							tabData={this.state.tabsList}
							utilityClick={this.handleUtilityClick}
							handleViewChange={this.handleViewChange}
							viewChange={this.state.viewChange}
							handleRefresh={this.handleRefresh}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default MainPage;
