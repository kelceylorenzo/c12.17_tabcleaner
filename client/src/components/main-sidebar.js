import React, { Component } from "react";
import "../assets/css/main-sidebar.css";

class Sidebar extends Component {
	render() {
		return (
			<div className="sidebar-container col-xs-1">
				<button>OPEN</button>

				<button>CLOSE</button>

				<button>SELECT ALL</button>

				<button>DESELECT ALL</button>
			</div>
		);
	}
}

export default Sidebar;
