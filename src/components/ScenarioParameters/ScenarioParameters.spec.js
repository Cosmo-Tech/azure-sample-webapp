// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { ScenarioParameters } from '.';
import { customRender } from '../../../tests/utils/renderInThemeAndStoreProviders';
import { localStorageMock } from '../../../tests/mocks';
import { AccordionTesting } from '../../../tests/MuiComponentsTesting/AccordionTesting';

const getIsAccordionExpanded = () => {
  return localStorage.getItem('scenarioParametersAccordionExpanded') === true;
};

const mockOnToggleAccordion = jest.fn(() => {
  const isExpanded = localStorage.getItem('scenarioParametersAccordionExpanded');
  localStorage.setItem('scenarioParametersAccordionExpanded', !isExpanded);
});

jest.mock('./components', () => ({
  __esModule: true,
  ScenarioParametersTabsWrapper: () => {
    return <div data-testid="scenario_parameters_tabs_wrapper">Wrapper</div>;
  },
  ScenarioActions: () => {
    return <div data-testid="scenario-actions" />;
  },
}));

const Accordion = new AccordionTesting({ dataCy: 'scenario-params-accordion' });
const getScenarioActionsButtons = () => screen.getByTestId('scenario-actions');
const getTabsWrapper = () => screen.getByTestId('scenario_parameters_tabs_wrapper');

const getProps = () => {
  return { onToggleAccordion: mockOnToggleAccordion, isAccordionExpanded: getIsAccordionExpanded() };
};

describe('can fold and unfold scenario parameters accordion', () => {
  beforeEach(() => {
    mockOnToggleAccordion.mockClear();
  });

  it('unfolds the accordion based on localStorage data', () => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock({ scenarioParametersAccordionExpanded: false }),
    });
    const { rerender } = customRender(<ScenarioParameters {...getProps()} />);
    expect(Accordion.Container).toBeVisible();
    expect(Accordion.ToggleButton).toBeVisible();
    expect(getScenarioActionsButtons()).toBeVisible();
    expect(getTabsWrapper()).not.toBeVisible();
    fireEvent.click(Accordion.ToggleButton);
    expect(mockOnToggleAccordion).toHaveBeenCalled();
    rerender(<ScenarioParameters {...getProps()} />);
    expect(getTabsWrapper()).toBeVisible();
  });

  it('folds the accordion based on localStorage data', async () => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock({ scenarioParametersAccordionExpanded: true }),
    });
    const { rerender } = customRender(<ScenarioParameters {...getProps()} />);
    expect(Accordion.Container).toBeVisible();
    expect(Accordion.ToggleButton).toBeVisible();
    expect(getScenarioActionsButtons()).toBeVisible();
    expect(getTabsWrapper()).toBeVisible();
    fireEvent.click(Accordion.ToggleButton);
    expect(mockOnToggleAccordion).toHaveBeenCalled();
    rerender(<ScenarioParameters {...getProps()} />);
    await waitFor(() => expect(getTabsWrapper()).not.toBeVisible());
  });
});
