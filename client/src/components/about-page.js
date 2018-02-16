import React from 'react';
import Header from './header';
import headerData from './header-data';

import teamPicture from '../assets/images/about-us-mainimage.png';

export default (props) => {
	return (
		<div className="about-page">
			<div className="header-container">
				<Header routes={headerData} />
			</div>
			<div className="about-page-content-container">
				<div className="team-picture-container">
					<img className="team-picture" src={teamPicture} />
				</div>
				<div className="description-container">
					<p className="description">
						<b>DESCRIPTION OF OUR TEAM</b> We make tabs work for you. In exercitation enim consequat
						incididunt aute consectetur. Non exercitation et cupidatat veniam sint ex non culpa
						excepteur cupidatat nostrud non velit nulla. Ea in adipisicing enim magna do aute in
						aliquip commodo exercitation. Cupidatat tempor excepteur anim tempor non ex nostrud
						aliquip.
					</p>
				</div>
				<div className="team-links-container">
					<div className="team-link">
						<p>Andrea</p>
						<p>Github | Portfolio</p>
					</div>
					<div className="team-link">
						<p>Henry</p>
						<p>Github | Portfolio</p>
					</div>
					<div className="team-link">
						<p>James</p>
						<p>Github | Portfolio</p>
					</div>
					<div className="team-link">
						<p>Kelcey</p>
						<p>Github | Portfolio</p>
					</div>
					<div className="team-link">
						<p>Nick</p>
						<p>Github | Portfolio</p>
					</div>
				</div>
			</div>
		</div>
	);
};
