import React, { Component } from "react";
import "../assets/css/main-sidebar.css";

class Sidebar extends Component {
	render() {
		return (

			<div className="sidebar-container col-xs-1">

				<button onClick={this.props.openTab}>OPEN</button>

				<button onClick={this.props.closeTab}>CLOSE</button>
				
				<button onClick={this.props.selectAll}>SELECT ALL</button>
			
				<button onClick={this.props.deselectAll}>DESELECT ALL</button>

			</div>
		);
	}
}

export default Sidebar;
