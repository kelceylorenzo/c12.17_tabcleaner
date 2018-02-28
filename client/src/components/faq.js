import React from 'react';
import { Link } from 'react-router-dom';
import Header from './header';
import headerData from './header-data';

import mainPicture from '../assets/images/faq-mainpic.jpeg';

export default (props) => {
	return (
		<div>
			<div className="header-container">
				<a href="/dashboard" className="back-link-container">
					<div className="nav-link">BACK</div>
				</a>
			</div>
			<div className="faq-page-container">
				<h1 className="faq-page-title">Frequently Asked Questions</h1>
				<div className="faq-main-info">
					<img src={mainPicture} />
					<div>
						<h2>How does it work?</h2>
						<p>
							Close Your Tabs incorporates a Chrome extension to keep track of how long a tab has
							been inactive and active. We display your current tabs from all windows and color them
							according to the amount of time elapsed since the tab was used. This tools helps you
							see which tabs are not being used in a colorful manner.
						</p>
						<p>
							To use the time-tracking system, add our extension in the Chrome Store and you will
							notice our tab logo pops up in your Chrome toolbar. Click the tab, and you will see all
							your current tabs!
						</p>
					</div>
				</div>
				<h2>General information</h2>

				<h4>How do I use the website?</h4>
				<p>
					If you are not logged in, you will be directed to our landing page with includes information
					about the app and extension as well as buttons to sign up or login.
				</p>

				<h4>What's with the different colors?</h4>
				<p>
					The white tab is your current active tab for each window. The green tab are your more recently
					visited tabs. The yellow tabs have been open for at least _________ time. Lastly, the red tabs
					have not been visited in a long, long time. Hence, bookmark if necessary and close this tab.
				</p>

				<h4>How do I use the chrome extension?</h4>
				<p>
					The extension is running as long as you have it enabled. You will see the tab icon in your
					toolbar. To check how long your tabs have been inactive, click the tab and you will see all of
					your tabs color-coded.
				</p>

				<h4>How do I stop using the app?</h4>
				<p>
					You can either remove or disable the extension in the Chrome Store or{' '}
					<a href="chrome://extensions/">here</a>.{' '}
				</p>

				<h4>Can I use this on my phone?</h4>
				<p>
					The chrome extension does not work on your phone, however, if you have an account, you can
					visit the dashboard on the website to see your current Chrome tabs.
				</p>

				<h4>Can I change the colors of the tabs in the extension?</h4>
				<p>Not currently, but this is a plan for a future version!</p>

				<h4>Is my browser history being saved?</h4>
				<p>No, except you can access stats such as total website usage time. </p>
				<hr />

				<h2>Account Details</h2>

				<h4>Where do I log in?</h4>
				<p>
					You can log on using either our website or chrome extension. You will notice the tab icon in
					the chrome toolbar changes colors depending on your log in status. The purple tabs means you
					are logged out while the green background means you are logged in!
				</p>

				<h4>Do I have to make an account to use the app?</h4>
				<p>
					No, you can use the chrome extension without an account, but you will not have access to see
					your Chrome tabs on your phone or another browser. The website is an extension of the
					extension, including more information about your tab usage, including the total amount of time
					spend on various websites.
				</p>

				<h4>Do I need a Google account?</h4>
				<p>
					If you want to use the features included on the website, yes. We encourage this. The benefit to
					having an account is to access your current browser tab on your phone.
				</p>
			</div>
		</div>
	);
};
