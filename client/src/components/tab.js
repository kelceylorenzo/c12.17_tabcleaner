import React from 'react';
import placeholderImage from '../assets/images/e9492f0f82721e4998b1360e409e6fe8affc30bb.png';
import checkMark from '../assets/images/check-mark.png';

export default (props) => {
	let selectStyle = {
		display: ''
	};

	let tabStyle = {
		backgroundColor: ''
	};

	if (props.item.selected) {
		selectStyle.display = 'flex';
	}

	let currentTime = new Date();
	currentTime = currentTime.getTime();
	let inactiveElapsedTime = currentTime - props.item.deactivatedTime;

	if (inactiveElapsedTime < 10000 || props.item.tabTitle === 'Close Your Tabs') {
		tabStyle.backgroundColor = '';
	} else if (inactiveElapsedTime < 25000) {
		tabStyle.backgroundColor = 'rgba(215, 213, 170, 0.5)';
	} else {
		tabStyle.backgroundColor = 'rgba(156, 95, 88, 0.5)';
	}

	let viewClass = {
		container: 'tab-container',
		tab: 'tab',
		title: 'tab-title',
		tabScreen: 'tab-screenshot',
		overlayContainer: 'select-overlay-container',
		utilityContainer: 'tab-utilities-container'
	};

	if (props.viewChange === 'list') {
		(viewClass.container = 'list-tab-container'),
			(viewClass.tab = 'list-tab'),
			(viewClass.title = 'list-tab-title'),
			(viewClass.tabScreen = 'list-tab-screenshot'),
			(viewClass.overlayContainer = 'list-select-overlay-container');
		viewClass.utilityContainer = 'list-utilities-container';
	}

	return (
		<div className={viewClass.container} onClick={props.select}>
			<div className={viewClass.overlayContainer} style={selectStyle}>
				<img className="select-overlay" src={checkMark} alt="" />
			</div>

			<div className={viewClass.tab} style={tabStyle}>
				<div className={viewClass.title}>{props.item.tabTitle}</div>
				<div className={viewClass.tabScreen}>
					<img src={placeholderImage} alt="" />
				</div>
				<div className={viewClass.utilityContainer}>
					<div
						className="tab-utility open-favicon"
						onClick={() => props.utilityClick(props.item, 'open')}
					>
						<i className="fas fa-external-link-alt" />
					</div>
					<div
						className="tab-utility close-favicon"
						// onClick={() => props.utilityClick(props.item, 'close')}
					>
						<i className="fas fa-times" />
					</div>
				</div>
			</div>
		</div>
	);
};
