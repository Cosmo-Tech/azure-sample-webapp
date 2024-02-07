// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

/* eslint-disable react/prop-types */
import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createMockStore, MockFormProvider } from '../mocks';
import MockTheme from '../mocks/MockThemeProvider';
import { DEFAULT_REDUX_STATE } from '../samples';

const mockStore = createMockStore(DEFAULT_REDUX_STATE);

const AllProviders = ({ children }) => {
  return (
    <Provider store={mockStore}>
      <MockTheme>
        <MockFormProvider>{children}</MockFormProvider>
      </MockTheme>
    </Provider>
  );
};

export const customRender = (ui, options) => render(ui, { wrapper: AllProviders, ...options });
