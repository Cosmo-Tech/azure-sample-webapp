// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
/* eslint-disable react/prop-types */

import { Provider } from 'react-redux';
import MockTheme from '../mocks/MockThemeProvider';
import { createMockStore, MockFormProvider } from '../mocks';
import React from 'react';
import { DEFAULT_REDUX_STATE } from '../samples';
import { render } from '@testing-library/react';

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
