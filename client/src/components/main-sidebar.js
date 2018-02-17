import React, { Component } from "react";

class Sidebar extends Component {
	render() {
		return (
			<div className="side-bar-container">
				<button className="button" onClick={this.props.openTab}>
					OPEN
				</button>
				<button className="button" onClick={this.props.closeTab}>
					CLOSE/DELETE
				</button>
				<button className="button" onClick={this.props.selectAll}>
					SELECT ALL
				</button>
				<button className="button" onClick={this.props.deselectAll}>
					DESELECT ALL
				</button>
				{/* <h4>Sort</h4>
				<button className="button" data-sortType="A-Z" onClick={this.props.sort}>
					A-Z
				</button>
				<button className="button" data-sortType="Z-A" onClick={this.props.sort}>
					Z-A
				</button>
				<button className="button" data-sortType="Time" onClick={this.props.sort}>
					Time
				</button>
				<button className="button" data-sortType="Window" onClick={this.props.sort}>
					Window
				</button> */}
			</div>
		);
	}
}

export default Sidebar;
