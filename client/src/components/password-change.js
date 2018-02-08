import React, { Component } from 'react';

class PasswordChange extends Component {
	render() {
		return (
			<div className="change-container col s5">
				<p>Change Password</p>
				<form>
					<label>Old Password</label>
					<input type="email" />
					<label>New Password</label>
					<input type="email" />
					<label>Confirm New Password</label>
					<input type="email" />
					<button type="button">Cancel</button>
					<button type="submit">Save Changes</button>
				</form>
			</div>
		);
	}
}

export default PasswordChange;
