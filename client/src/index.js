import React from 'react';
import { render } from 'react-dom';
// import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

import './index.css';
import App from './App';

render((
  <CookiesProvider>
        <App/>
        </CookiesProvider>
), document.getElementById('root'));
