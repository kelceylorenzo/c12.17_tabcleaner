import React from 'react';
import Footer from './footer';
import FooterData from './footer-data';
import 'materialize-css/dist/css/materialize.min.css';
import '../assets/css/footer.css';

const App = () => (
	<div>
		<div className="app">
			<Footer footerData={FooterData} />
		</div>
	</div>
);

export default App;
