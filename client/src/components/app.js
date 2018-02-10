import React from "react";
import MainPage from "./main-page";

import AboutContent from "./about-content";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => (
	<div>
		<div className="main-app">
			<AboutContent />
			{/* <MainPage /> */}
		</div>
	</div>
);

export default App;
