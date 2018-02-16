import React, { Component } from "react";

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
			<div className="container-fluid">
				<div className="signup-page-container">
					<div className="row">
						<div className="col-md-1 col-md-offset-9">
							<button className="btn btn-default btn-lg">LOG IN</button>
						</div>
					</div>
					<div className="input-container text-center">
						<h1>APPLICATION NAME</h1>
						<button className="btn btn-default btn-lg">SIGN UP WITH GOOGLE</button>
						<div>-OR-</div>

						<form className="form-horizontal">
							<div className="form-group">
								<div className="col-md-2 col-md-offset-5">
									<input
										name="email"
										value={email}
										type="text"
										placeholder="email"
										className="validate"
										onChange={this.handleFormInput}
										className="form-control"
									/>
								</div>
							</div>
							<div className="form-group">
								<div className="col-md-2 col-md-offset-5">
									<input
										name="password"
										value={password}
										type="text"
										placeholder="password"
										className="validate"
										onChange={this.handleFormInput}
										className="form-control"
									/>
								</div>
							</div>
							<div className="form-group">
								<div className="col-md-2 col-md-offset-5">
									<input
										name="verifyPassword"
										value={verifyPassword}
										type="text"
										placeholder="verify password"
										className="validate"
										onChange={this.handleFormInput}
										className="form-control"
									/>
								</div>
							</div>
						</form>

						<button className="btn btn-default btn-lg">SIGN UP</button>
					</div>
				</div>
			</div>
		);
	}
}

export default SignUp;
