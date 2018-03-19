import React, { Component } from 'react';

class Sidebar extends Component {
	render() {
		return (
			<div className="side-bar-container">
				<button className="button" onClick={this.props.openTab}>
					OPEN
				</button>
				<button
					className="button sidebar-delete"
					onClick={() => {
						setTimeout(this.props.closeTab, 500);
					}}
				>
					CLOSE/DELETE
				</button>
				<button className="button" onClick={this.props.selectAll}>
					SELECT ALL
				</button>
				<button className="button" onClick={this.props.deselectAll}>
					DESELECT ALL
				</button>
			</div>
		);
	}
}

export default Sidebar;
