import React from 'react';
import Header from './header';
import HeaderData from './header-data';
import 'materialize-css/dist/css/materialize.min.css';
import '../assets/css/header.css';

const App = () => (
	<div>
		<div className="app">
			<Header headerData={HeaderData} />
		</div>
	</div>
);

export default App;
