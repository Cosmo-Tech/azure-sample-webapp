// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { i18next } from './services/config/i18next';
import applicationStore from './state/Store.config';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

ReactDOM.render(
  <Suspense fallback="">
    <React.StrictMode>
      <BrowserRouter>
        <Provider store={applicationStore}>
          <I18nextProvider i18n={i18next}>
            <App />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
  </Suspense>,
  document.getElementById('root')
);
