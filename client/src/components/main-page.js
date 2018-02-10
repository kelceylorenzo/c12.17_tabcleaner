import React from 'react';
import MainSidebar from './main-sidebar';
import MainTabArea from './main-tab-area';

export default (props) => {
	return (
		<div className="main-page-container">
			<h4>navbar will go here</h4>
			<div className="row">
				<MainSidebar />
				<MainTabArea />
			</div>
		</div>
	);
};
