import React, { Component } from "react";

import "../assets/css/signup-page.css";

class SignUp extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: "",
			password: "",
			verifyPassword: ""
		};
		this.handleFormInput = this.handleFormInput.bind(this);
	}

	handleFormInput(event) {
		const { name, value } = event.target;
		this.setState({
			[name]: value
		});
	}

	render() {
		const { email, password, verifyPassword } = this.state;
		return (
			<div className="signup-page-container">
				<div className="row">
					<button className="btn-large col s1 offset-s10">LOG IN</button>
				</div>

				<div className="center-align">
					<h1>APPLICATION NAME</h1>
					<button className="btn-large">SIGN UP WITH GOOGLE</button>
					<div>-OR-</div>
					<div className="input-container">
						<div className="row">
							<form className="col s4 offset-s4">
								<input
									name="email"
									value={email}
									type="text"
									placeholder="email"
									className="validate"
									onChange={this.handleFormInput}
								/>
								{/* </form> */}
								{/* </div> */}
								{/* <div className="row"> */}
								{/* <form className="col s4 offset-s4"> */}
								<input
									name="password"
									value={password}
									type="text"
									placeholder="password"
									className="validate"
									onChange={this.handleFormInput}
								/>
								<input
									name="verifyPassword"
									value={verifyPassword}
									type="text"
									placeholder="verify password"
									className="validate"
									onChange={this.handleFormInput}
								/>
							</form>
						</div>
						<button className="btn-large">SIGN UP</button>
					</div>
				</div>
			</div>
		);
	}
}

export default SignUp;
