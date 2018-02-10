import React from 'react';
import Footer from './footer';
import FooterData from './footer-data';
import Header from './header';
import HeaderData from './header-data';
import 'materialize-css/dist/css/materialize.min.css';
import '../assets/css/header.css';

const App = () => (
	<div>
		<div className="app">
			<Header headerData={HeaderData} />
      <Footer footerData={FooterData} />
		</div>
	</div>
);

export default App;
