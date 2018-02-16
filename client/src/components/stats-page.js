import React from 'react';
import Header from './header';
import headerData from './header-data';

export default (props) => {
	return (
		<div>
			<div className="header-container">
				<Header routes={headerData} />
			</div>
			<div>
				<div>
					<div>
						<h1>Stats Page</h1>
					</div>
					<div>
						<div>
							<span>You've spent 100 hours on YouTube</span>
						</div>
						<div>
							<span>You've spent 200 hours on Reddit</span>
						</div>
						<div>
							<span>You've spent 180 hours on Facebook</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
