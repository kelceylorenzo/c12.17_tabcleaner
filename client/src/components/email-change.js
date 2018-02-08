import React, { Component } from 'react';

class EmailChange extends Component {
	constructor(props) {
		super(props);

		this.state = {
			oldEmail: '',
			newEmail: '',
			confirmNewEmail: '',
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
			oldEmail: '',
			newEmail: '',
			confirmNewEmail: '',
			feedback: ''
		});
	}

	submit(event) {
		event.preventDefault();
		const { oldEmail, newEmail, confirmNewEmail } = this.state;
		console.log(`oldEmail: ${oldEmail}, newEmail: ${newEmail}, confirmNewEmail: ${confirmNewEmail}`);

		let newState =
			oldEmail === '' || newEmail === '' || confirmNewEmail === ''
				? (newState = {
						...this.state,
						feedback: 'please fill out each section before saving your changes.'
					})
				: newEmail === oldEmail
					? (newState = {
							...this.state,
							feedback: 'new email cannot match old email. please enter a new email.'
						})
					: newEmail !== confirmNewEmail
						? (newState = {
								...this.state,
								feedback: 'new email confirmation does not match. please check your spelling'
							})
						: (newState = {
								...this.state,
								feedback: 'email change successful!'
							});

		this.setState(newState);
	}

	render() {
		const { oldEmail, newEmail, confirmNewEmail, feedback } = this.state;
		return (
			<div className="change-container col s5 offset-s1">
				<p>Change E-Mail</p>
				<form>
					<label>Old E-Mail</label>
					<input type="email" name="oldEmail" value={oldEmail} onChange={this.updateInput} />
					<label>New E-Mail</label>
					<input type="email" name="newEmail" value={newEmail} onChange={this.updateInput} />
					<label>Confirm New E-Mail</label>
					<input
						type="email"
						name="confirmNewEmail"
						value={confirmNewEmail}
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

export default EmailChange;
