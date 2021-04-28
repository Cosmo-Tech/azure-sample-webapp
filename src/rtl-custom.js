// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { Suspense } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './state/reducers/rootReducer';
import theme from './theme';

const customRender = (ui, {
  initialStateForStore,
  store = createStore(reducer, initialStateForStore),
  ...renderOptions
} = {}) => {
  const AllTheProviders = ({ children }) => {
    return (
        <Suspense fallback="loading">
          <BrowserRouter>
            <Provider store={store}>
              <ThemeProvider theme={theme}>
                  {children}
              </ThemeProvider>
            </Provider>
          </BrowserRouter>
        </Suspense>
    );
  };
  AllTheProviders.propTypes = {
    children: PropTypes.element
  };
  return rtlRender(ui, { wrapper: AllTheProviders, ...renderOptions });
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
