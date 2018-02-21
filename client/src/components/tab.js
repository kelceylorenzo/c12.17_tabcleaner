import React from 'react';
import placeholderImage from '../assets/images/e9492f0f82721e4998b1360e409e6fe8affc30bb.png';
import checkMark from '../assets/images/check-mark.png';

export default (props) => {
	let style = {
		display: ''
	};

	if (props.item.selected) {
		style.display = 'flex';
	}

	return (
		<div className="tab-container" onClick={props.select}>
			<div className="select-overlay-container" style={style}>
				<img className="select-overlay" src={checkMark} alt="" />
			</div>

			<div className="tab">
				<div className="tab-title">{props.item.title}</div>
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
						onClick={() => props.utilityClick(props.item, 'close')}
					>
						<i className="fas fa-times" />
					</div>
				</div>
			</div>
		</div>
	);
};
