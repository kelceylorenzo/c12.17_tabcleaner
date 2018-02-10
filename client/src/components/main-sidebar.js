import React, { Component } from 'react';
import '../assets/css/main-sidebar.css';

class Sidebar extends Component {
	render() {
		return (
			<div className="sidebar-container">
				<button>OPEN</button>
				<br />
				<button>CLOSE</button>
				<br />
				<button onClick={this.props.selectAll}>SELECT ALL</button>
				<br />
				<button onClick={this.props.deselectAll}>DESELECT ALL</button>
			</div>
		);
	}
}

export default Sidebar;
