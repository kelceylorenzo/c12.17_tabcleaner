import React, { Component } from 'react';

class PasswordChange extends Component {
	constructor(props) {
		super(props);

		this.state = {
			oldPassword: '',
			newPassword: '',
			confirmNewPassword: '',
			feedback: ''
		};

		this.updateInput = this.updateInput.bind(this);
		this.cancel = this.cancel.bind(this);
		this.submit = this.submit.bind(this);
	}

	updateInput(event) {
		const { name, value } = event.target;

		this.setState({
			...this.state,
			[name]: value
		});
	}

	cancel() {
		this.setState({
			oldPassword: '',
			newPassword: '',
			confirmNewPassword: '',
			feedback: ''
		});
	}

	submit(event) {
		event.preventDefault();
		const { oldPassword, newPassword, confirmNewPassword } = this.state;

		let newState =
			oldPassword === '' || newPassword === '' || confirmNewPassword === ''
				? (newState = {
						...this.state,
						feedback: 'please fill out each section before saving your changes.'
					})
				: newPassword === oldPassword
					? (newState = {
							...this.state,
							feedback: 'new password cannot match previous password. please enter a new password.'
						})
					: newPassword !== confirmNewPassword
						? (newState = {
								...this.state,
								feedback: 'new password confirmation does not match. please check your spelling'
							})
						: (newState = {
								...this.state,
								feedback: 'password change successful!'
							});
		console.log(
			`oldPassword: ${oldPassword}, newPassword: ${newPassword}, confirmNewPassword: ${confirmNewPassword}`
		);
		this.setState(newState);
	}

	render() {
		const { oldPassword, newPassword, confirmNewPassword, feedback } = this.state;
		return (
			<div className="change-container col s5 offset-s1">
				<p>Change Password</p>
				<form>
					<label>Old Password</label>
					<input type="password" name="oldPassword" value={oldPassword} onChange={this.updateInput} />
					<label>New Password</label>
					<input type="password" name="newPassword" value={newPassword} onChange={this.updateInput} />
					<label>Confirm New Password</label>
					<input
						type="password"
						name="confirmNewPassword"
						value={confirmNewPassword}
						onChange={this.updateInput}
					/>
					<button type="button" onClick={this.cancel}>
						Cancel
					</button>
					<button type="submit" onClick={this.submit}>
						Save Changes
					</button>
				</form>
				<div>{feedback}</div>
			</div>
		);
	}
}

export default PasswordChange;
