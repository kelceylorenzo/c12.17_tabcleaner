import React from "react";
import { Link } from "react-router-dom";

export default props => {
	return (
		<div>
			<div>
				<div>
					<div>
						<h1>Close Your Tabs</h1>
					</div>
					<div>
						<div>
							<Link to="/dashboard">
								LOG IN
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
