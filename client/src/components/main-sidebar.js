import React, { Component } from 'react';
import '../assets/css/main-sidebar.css';

class Sidebar extends Component {
	render() {
		return (
			<div className="sidebar-container col s2">
				<button>OPEN</button>
				<br />
				<button>CLOSE</button>
				<br />
				<button>SELECT ALL</button>
				<br />
				<button>DESELECT ALL</button>
			</div>
		);
	}
}

export default Sidebar;
