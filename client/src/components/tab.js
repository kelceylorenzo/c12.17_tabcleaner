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
	console.log('deactivated time: ', props.item.deactivatedTime);
	console.log('inactive elapsed time: ', inactiveElapsedTime);
	console.log('less than 100000: ', inactiveElapsedTime < 100000);
	console.log('less than 250000: ', inactiveElapsedTime < 250000);

	if (inactiveElapsedTime < 100000) {
		tabStyle.backgroundColor = '';
	} else if (inactiveElapsedTime < 250000) {
		tabStyle.backgroundColor = 'rgba(215, 213, 170, 0.5)';
	} else {
		tabStyle.backgroundColor = 'rgba(156, 95, 88, 0.5)';
	}

	return (
		<div className="tab-container" onClick={props.select} style={tabStyle}>
			<div className="select-overlay-container" style={selectStyle}>
				<img className="select-overlay" src={checkMark} alt="" />
			</div>

			<div className="tab">
				<div className="tab-title">{props.item.tabTitle}</div>
				<div className="tab-screenshot">
					<img src={placeholderImage} alt="" />
				</div>
				<div className="tab-utilities-container">
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
