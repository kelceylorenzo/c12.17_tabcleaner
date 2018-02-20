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
			<div className="about-page-title-container">
				<div className="about-page-title">MEET THE TABS TEAM</div>
			</div>
			<div className="about-page-container">
				<div className="team-picture-container">
					<img className="team-picture" src={teamPicture} />
				</div>
				<div className="about-page-content-container">
					<div className="description-container">
						<div className="about-content-title">We make tabs work for you.</div>
						<p className="description">
							<b>DESCRIPTION OF OUR TEAM</b> In exercitation enim consequat incididunt aute
							consectetur. Non exercitation et cupidatat veniam sint ex non culpa excepteur cupidatat
							nostrud non velit nulla. Ea in adipisicing enim magna do aute in aliquip commodo
							exercitation. Cupidatat tempor excepteur anim tempor non ex nostrud aliquip.
						</p>
					</div>
					<div className="team-members-container">
						<div className="first-row">
							<div className="team-member">
								<div className="team-member-name">
									<p>Andrea</p>
								</div>
								<div className="team-member-links-container">
									<div className="team-member-link">
										<a href="https://github.com/andreasandpiper" target="_blank">
											<i className="fab fa-github" />
										</a>
									</div>
									<div className="team-member-link">
										<a href="http://www.andreawayte.com/" target="_blank">
											<i className="fas fa-address-card" />
										</a>
									</div>
									<div className="team-member-link">
										<a href="https://www.linkedin.com/in/andrea-wayte/" target="_blank">
											<i className="fab fa-linkedin" />
										</a>
									</div>
								</div>
							</div>
							<div className="team-member">
								<div className="team-member-name">
									<p>Henry</p>
								</div>
								<div className="team-member-links-container">
									<div className="team-member-link">
										<a href="https://github.com/HyeManMoon" target="_blank">
											<i className="fab fa-github" />
										</a>
									</div>
									<div className="team-member-link">
										<a href="http://henrymoon.net/" target="_blank">
											<i className="fas fa-address-card" />
										</a>
									</div>
									<div className="team-member-link">
										<a href="https://www.linkedin.com/in/hye-moon-59405a157/" target="_blank">
											<i className="fab fa-linkedin" />
										</a>
									</div>
								</div>
							</div>
						</div>
						<div className="second-row">
							<div className="team-member">
								<div className="team-member-name">
									<p>James</p>
								</div>
								<div className="team-member-links-container">
									<div className="team-member-link">
										<a href="https://github.com/jkirsch-LF " target="_blank">
											<i className="fab fa-github" />
										</a>
									</div>
									<div className="team-member-link">
										<a href="http://jkirsch.tech/" target="_blank">
											<i className="fas fa-address-card" />
										</a>
									</div>
									<div className="team-member-link">
										<a href="https://www.linkedin.com/in/jameskirsch/" target="_blank">
											<i className="fab fa-linkedin" />
										</a>
									</div>
								</div>
							</div>
							<div className="team-member">
								<div className="team-member-name">
									<p>Kelcey</p>
								</div>
								<div className="team-member-links-container">
									<div className="team-member-link">
										<a href="https://github.com/m13kelore/" target="_blank">
											<i className="fab fa-github" />
										</a>
									</div>
									<div className="team-member-link">
										<a href="http://www.kelceylorenzo.com/" target="_blank">
											<i className="fas fa-address-card" />
										</a>
									</div>
									<div className="team-member-link">
										<a href="https://www.linkedin.com/in/kelcey-lorenzo/" target="_blank">
											<i className="fab fa-linkedin" />
										</a>
									</div>
								</div>
							</div>
							<div className="team-member">
								<div className="team-member-name">
									<p>Nick</p>
								</div>
								<div className="team-member-links-container">
									<div className="team-member-link">
										<a href="https://github.com/nickkquan" target="_blank">
											<i className="fab fa-github" />
										</a>
									</div>
									<div className="team-member-link">
										<a href="http://nickquan.com/" target="_blank">
											<i className="fas fa-address-card" />
										</a>
									</div>
									<div className="team-member-link">
										<a href="https://www.linkedin.com/in/nick-quan/" target="_blank">
											<i className="fab fa-linkedin" />
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="page-switches-container">
						<i className="fas fa-circle" />
						<i className="fas fa-circle" />
					</div>
				</div>
			</div>
		</div>
	);
};
