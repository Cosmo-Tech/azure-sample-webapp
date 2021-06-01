// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState as useStateMock } from 'react';
import App from '../App';
import { render } from '../rtl-custom';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { signIn } from '../utils/SignUtils';
import { Provider } from 'react-redux';
import theme from '../theme';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';

const initialStore = {
  scenario: {
    list: {
      data: [],
      status: 'IDLE'
    },
    current: {
      data: null,
      status: 'IDLE'
    }
  },
  application: {
    status: 'IDLE'
  }
};
const mockStore = configureStore([]);

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn()
}));

jest.mock('../utils/SignUtils');

describe('App test suite with state default value', () => {
  const setState = jest.fn();

  beforeEach(() => {
    useStateMock
      .mockImplementation(init => [init, setState]);

    signIn.mockImplementation(() => Promise.resolve(true));
  });

  // TODO Fix following tests
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should render correclty the loading auth', () => {
    const elem = renderer.create(<App />).toJSON();
    expect(elem).toMatchSnapshot();
  });

  // eslint-disable-next-line jest/expect-expect
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('renders App loading', () => {
    const { getByText } = render(<App />, { initialStateForStore: initialStore, store: mockStore(initialStore) });
    getByText('views.common.text.loading');
  });
});

// TODO Fix following tests
// Errors thrown:
// - The above error occurred in the <ForwardRef(Modal)> component
// - The above error occurred in the <ForwardRef(Tabs)> component
// See thread : https://stackoverflow.com/questions/67227163/material-ui-react-test-renderer-react-router-tabs-tab-component-and-modal
describe('App test suite with loading value to false', () => {
  const setState = jest.fn();

  beforeEach(() => {
    useStateMock
      .mockImplementationOnce(init => [init, setState])
      .mockImplementationOnce(init => [init, setState])
      .mockImplementationOnce(() => [false, setState]);

    signIn.mockImplementation(() => Promise.resolve(true));
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should render correclty the loading auth', () => {
    const elem = renderer.create(
        <BrowserRouter>
          <Provider store={mockStore(initialStore)}>
            <ThemeProvider theme={theme}>
              <App/>
            </ThemeProvider>
          </Provider>
        </BrowserRouter>).toJSON();
    expect(elem).toMatchSnapshot();
  });

  // eslint-disable-next-line jest/expect-expect
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('renders App loading', () => {
    const { getByText } = render(<App />, { initialStateForStore: initialStore, store: mockStore(initialStore) });
    getByText('views.common.text.loading');
  });
});
