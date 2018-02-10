import React from 'react';
import MainSidebar from './main-sidebar';
import MainTabArea from './main-tab-area';
import data from '../assets/data/data';
import '../assets/css/main-page.css';

export default (props) => {
	return (
		<div>
			<h4>navbar will go here</h4>
			<div className="main-page-container">
				<MainSidebar />
				<MainTabArea tabData={data} />
			</div>
		</div>
	);
};
