import React, { Component } from 'react';

class Sort extends Component {
	render() {
		return (
			<div className="sort-by-menu">
				<p className="sort-by-title">Sort By:</p>
				<p className="sort-by-option" onClick={(event) => this.props.sort('window', event)}>
					Window
				</p>
				<p className="sort-by-option" onClick={() => this.props.sort('time')}>
					Time
				</p>
				<p className="sort-by-option" onClick={() => this.props.sort('az')}>
					Title (A-Z)
				</p>
				<p className="sort-by-option" onClick={() => this.props.sort('za')}>
					Title (Z-A)
				</p>
			</div>
		);
	}
}

export default Sort;
