
import React, { Component } from 'react';
import MainSidebar from './main-sidebar';
import MainTabArea from './main-tab-area';
import data from '../assets/data/data';
import '../assets/css/main-page.css';
import tab from './tab';

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
	}

	componentDidMount() {
		//remove data parameter when adjusting code for axios calls
		this.getData(data);
	}

	//adjust getData code when ready to make axios/database calls (removing resp parameter and adding axios call)
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
		console.log(this.state);
		return (
			<div>
				<h4>navbar will go here</h4>
				<div className="main-page-container">
					<MainSidebar selectAll={this.selectAll} deselectAll={this.deselectAll} />
					<MainTabArea tabData={this.state.tabsList} select={this.handleIndividualSelect} />
				</div>
			</div>
		);
	}
}

export default MainPage;
