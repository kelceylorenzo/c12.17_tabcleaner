import React from 'react';

export default (props) => {
	let style = {
		backgroundColor: '',
		color: ''
	};

	if (props.item.selected) {
		style.backgroundColor = 'green';
		style.color = 'white';
	}

	return (
		<div className="tab" onClick={props.select} style={style}>
			<div className="tab-title">{props.item.title}</div>
			<div className="tab-screenshot" />
			<div className="tab-utilities-container">
				<div className="tab-utility open-favicon" onClick={() => props.utilityClick(props.item, 'open')}>
					<i className="fas fa-external-link-alt" />
				</div>
				<div className="tab-utility close-favicon" onClick={() => props.utilityClick(props.item, 'close')}>
					<i className="fas fa-times" />
				</div>
			</div>
		</div>
	);
};
