import React, { Component } from 'react';

class Sort extends Component {
	render() {
		return (
			<div className="sort-by-menu">
				<p className="sort-by-title">Sort By:</p>
				<p className="sort-by-option" data-sorttype="az" onClick={this.props.sort}>
					Title (A-Z)
				</p>
				<p className="sort-by-option" data-sorttype="za" onClick={this.props.sort}>
					Title (Z-A)
				</p>
				<p className="sort-by-option" data-sorttype="window" onClick={this.props.sort}>
					Window
				</p>
				<p className="sort-by-option" data-sorttype="time" onClick={this.props.sort}>
					Time
				</p>
			</div>
		);
	}
}

export default Sort;
