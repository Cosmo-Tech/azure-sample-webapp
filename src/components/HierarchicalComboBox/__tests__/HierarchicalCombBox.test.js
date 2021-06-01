// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import HierarchicalComboBox from '../HierarchicalComboBox';
import videoGamesList from './valuesList.json';

describe('HierarchicalComboBox test suite', () => {
  console.error = jest.fn();

  const maxLengthChar = 10;
  const subStringLenght = maxLengthChar / 2;
  const separator = ' ~~~ ';
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should select a too long name and display a truncated version of it', () => {
    const { container, getByRole, getByTestId } = render(
      <HierarchicalComboBox
        label="Video Games"
        values={videoGamesList}
        separator={separator}
        maxCharLength={maxLengthChar}
        handleChange={jest.fn()}
      />
    );

    for (const videoGame of videoGamesList) {
      fireEvent.click(getByRole('button'));
      fireEvent.click(getByTestId('option-' + videoGame.id));
      const videoGameName = videoGame.name.length > maxLengthChar
        ? (videoGame.name.substring(0, subStringLenght) + separator + videoGame.name.substring(videoGame.name.length - subStringLenght))
        : (videoGame.name);

      expect(container.querySelector('input')).toHaveAttribute('value', videoGameName);
    }
  });
});
