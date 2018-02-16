import React from "react";
import Header from "./header";
import headerData from "./header-data";

import teamPicture from "../assets/images/about-us-mainimage.png";

export default props => {
	return (
		<div>
			<div>
				<Header routes={headerData} />
			</div>
			<div>
				<div>
					<div>
						<img src={teamPicture} />
					</div>
				</div>
				<div>
					<div>
						<p>
							<b>DESCRIPTION OF OUR TEAM</b> We make tabs work for you.
						</p>
					</div>
				</div>
				<div>
					<div>
						<p>Andrea</p>
						<p>Github | Portfolio</p>
					</div>
					<div>
						<p>Henry</p>
						<p>Github | Portfolio</p>
					</div>
					<div>
						<p>James</p>
						<p>Github | Portfolio</p>
					</div>

					<div>
						<p>Kelcey</p>
						<p>Github | Portfolio</p>
					</div>
					<div>
						<p>Nick</p>
						<p>Github | Portfolio</p>
					</div>
				</div>
			</div>
		</div>
	);
};
