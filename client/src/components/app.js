import React from "react";
import MainPage from "./main-page";
import TopTen from "./topTen"

import "bootstrap/dist/css/bootstrap.min.css";

const App = () => (
	<div>
		<div className="main-app">
			<TopTen/>
		</div>
	</div>
);

export default App;
