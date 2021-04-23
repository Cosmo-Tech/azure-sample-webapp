// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import i18n from './configs/i18next.config';
import applicationStore from './state/Store.config';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';

ReactDOM.render(
    <Suspense fallback="loading">
      <React.StrictMode>
          <BrowserRouter>
              <Provider store={applicationStore}>
                  <I18nextProvider i18n={i18n}>
                      <ThemeProvider theme={theme}>
                        <App />
                      </ThemeProvider>
                  </I18nextProvider>
              </Provider>
          </BrowserRouter>
      </React.StrictMode>
    </Suspense>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
