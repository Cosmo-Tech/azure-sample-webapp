// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

/* eslint-disable react/prop-types */
import { render } from '@testing-library/react';
import React from 'react';
import { useConfirmOnRouteChange } from './RouterHooks';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useBlocker: () => jest.fn(),
}));

const confirmMessage = 'confirmMessage';
const DummyComponent = ({ displayConfirm }) => {
  const dialogProps = {
    body: confirmMessage,
  };

  useConfirmOnRouteChange(dialogProps, displayConfirm);
  return null;
};

const setUp = (displayConfirm) => {
  render(<DummyComponent displayConfirm={displayConfirm} />);
};

describe('RouterHooks', () => {
  describe('useConfirmOnRouteChange', () => {
    describe('With confirmation activated', () => {
      beforeEach(() => {
        setUp(true);
      });

      it('display confirmation on window unload', async () => {
        const event = new Event('beforeunload', { cancelable: true });
        const result = window.dispatchEvent(event);
        expect(result).toBeFalsy();
      });

      it(`don't display confirmation on window unload if logout in progress`, () => {
        sessionStorage.setItem('logoutInProgress', true);
        const event = new Event('beforeunload', { cancelable: true });
        const result = window.dispatchEvent(event);
        expect(result).toBeTruthy();
        sessionStorage.removeItem('logoutInProgress');
      });
    });

    describe('Without confirmation activated', () => {
      beforeEach(() => {
        setUp(false);
      });

      it(`don't display confirmation on window unload`, async () => {
        const event = new Event('beforeunload', { cancelable: true });
        const result = window.dispatchEvent(event);
        expect(result).toBeTruthy();
      });
    });
  });
});
