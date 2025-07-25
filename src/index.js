// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import { i18next } from './services/config/i18next';
import applicationStore from './state/Store.config';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Suspense fallback="">
    <Provider store={applicationStore}>
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    </Provider>
  </Suspense>
);
