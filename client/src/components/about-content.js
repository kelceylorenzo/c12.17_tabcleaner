import React from 'react';
import teamPicture from '../assets/images/about-us-mainimage.png';
import '../assets/css/about.css';

export default (props) => {
	return (
		<div className="about-content-container">
			<div className="row">
				<div className="col s12 center-align">
					<img src={teamPicture} className="about-main-image" />
				</div>
			</div>
			<div className="row">
				<div className="col s10 offset-s1">
					<p>
						<b>DESCRIPTION OF OUR TEAM</b> Ad minim aliquip non adipisicing aliqua occaecat elit
						commodo eiusmod veniam ad. Veniam irure id ad voluptate laborum nostrud voluptate ex non
						pariatur consequat pariatur ea elit. Sit eiusmod cupidatat exercitation qui esse nisi
						ullamco laborum sit aliqua culpa et elit. Sunt occaecat cupidatat proident labore
						consectetur in nulla et adipisicing Lorem qui culpa ullamco. Minim ex enim incididunt ex
						duis enim occaecat laborum ullamco cillum sit. Exercitation velit anim magna enim culpa
						aliquip eu deserunt dolore adipisicing ullamco est deserunt.
					</p>
				</div>
			</div>
			<div className="row">
				<div className="col s2 offset-s1 center-align">
					<p>Andrea</p>
					<p>Github | Portfolio</p>
				</div>
				<div className="col s2  center-align">
					<p>Henry</p>
					<p>Github | Portfolio</p>
				</div>
				<div className="col s2 center-align">
					<p>James</p>
					<p>Github | Portfolio</p>
				</div>

				<div className="col s2 center-align">
					<p>Kelcey</p>
					<p>Github | Portfolio</p>
				</div>
				<div className="col s2 center-align">
					<p>Nick</p>
					<p>Github | Portfolio</p>
				</div>
			</div>
			{/* <div className="row">
				<div className="col s4 offset-s2 center-align">
					<p>Henry</p>
					<p>Github | Portfolio</p>
				</div>
				<div className="col s4 center-align">
					<p>James</p>
					<p>Github | Portfolio</p>
				</div>
			</div>
			<div className="row">
				<div className="col s4 center-align">
					<p>Andrea</p>
					<p>Github | Portfolio</p>
				</div>
				<div className="col s4 center-align">
					<p>Kelcey</p>
					<p>Github | Portfolio</p>
				</div>
				<div className="col s4 center-align">
					<p>Nick</p>
					<p>Github | Portfolio</p>
				</div>
			</div> */}
		</div>
	);
};
