import React, { Component } from 'react';
// import MainSortButtons from './main-sort';
import '../assets/css/main-sidebar.css';

class Sidebar extends Component {
	render() {

		function sendTheData(){
			$.ajax({
				url: 'users',
				method: 'get',
				dataType: 'json',
				success: function(data){
					console.log(data);
				}
			})
		}

		return (
			<div className="sidebar-container col-xs-2">
				<div>
					<button onClick={this.props.openTab}>OPEN</button>
					<button onClick={this.props.closeTab}>CLOSE</button>
					<button onClick={this.props.selectAll}>SELECT ALL</button>
					<button onClick={this.props.deselectAll}>DESELECT ALL</button>
				</div>

				<h4>Sort</h4>

				<div>
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
					<button onClick={sendTheData()}>
						SEND DAT DATA
					</button>
				</div>
			
			</div>
		);
	}
}

export default Sidebar;
