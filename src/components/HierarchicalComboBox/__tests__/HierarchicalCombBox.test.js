// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import renderer from 'react-test-renderer';
import { fireEvent, prettyDOM, render, within, waitFor, getByDisplayValue } from '@testing-library/react'
import HierarchicalComboBox from '../HierarchicalComboBox';
import videoGamesList from '../__mocks__/treeForTests.json';

describe('HierarchicalComboBox test suite', () => {
  console.error = jest.fn();

  const maxLengthChar = 10;
  const subStringLenght = maxLengthChar / 2;
  const separator = " ~~~ ";

  it('should select a too long name and display a truncated version of it', () => {
    const { container, getByRole, getByTestId, debug, getByPlaceholderText } = render(
      <HierarchicalComboBox
        label="Video Games"
        tree={videoGamesList}
        separator={separator}
        maxCharLength={maxLengthChar}
        handleChange={jest.fn()}
      />
    );

    for (const videoGame of videoGamesList) {
      fireEvent.click(getByRole('button'));
      fireEvent.click(getByTestId('option-'+videoGame.id));
      const videoGameName = videoGame.name.length > maxLengthChar
        ? (videoGame.name.substring(0, subStringLenght) + separator + videoGame.name.substring(videoGame.name.length - subStringLenght))
        : (videoGame.name);
      
      expect(container.querySelector('input')).toHaveAttribute('value', videoGameName);
    }
  });

});
