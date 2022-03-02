import React from 'react';
import ReactDOM from 'react-dom';
import Navigation from './pages/Navigation';
import { BrowserRouter } from 'react-router-dom';
ReactDOM.render(
	<BrowserRouter>
		<Navigation />
	</BrowserRouter>
	, document.getElementById('root'));