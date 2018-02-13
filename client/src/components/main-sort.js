import React from 'react';

export default (props) => {
	console.log(props);
	return (
		<div className="sort-container">
			<button data-sortType="A-Z" onClick={this.props.sort}>
				A-Z
			</button>
			<button data-sortType="Z-A" onClick={this.props.sort}>
				Z-A
			</button>
			<button data-sortType="Time" onClick={this.props.sort}>
				Time
			</button>
			<button data-sortType="Window" onClick={this.props.sort}>
				Window
			</button>
		</div>
	);
};
