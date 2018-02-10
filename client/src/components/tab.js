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
		<div className="tab-container" onClick={props.select} style={style}>
			{props.item.url}
		</div>
	);
};
