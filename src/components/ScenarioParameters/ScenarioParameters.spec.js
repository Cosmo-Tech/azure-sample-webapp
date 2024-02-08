// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ScenarioParameters } from '.';
import { AccordionTesting } from '../../../tests/MuiComponentsTesting';
import { customRender } from '../../../tests/utils/renderInThemeAndStoreProviders';

const mockOnToggleAccordion = jest.fn();

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

const PROPS_WITH_ACCORDION_COLLAPSED = { onToggleAccordion: mockOnToggleAccordion, isAccordionExpanded: false };
const PROPS_WITH_ACCORDION_EXPANDED = { onToggleAccordion: mockOnToggleAccordion, isAccordionExpanded: true };

describe('accordion is expanded or collapsed', () => {
  beforeEach(() => {
    mockOnToggleAccordion.mockClear();
  });

  it('checks accordion is collapsed and prop function is called on click', () => {
    customRender(<ScenarioParameters {...PROPS_WITH_ACCORDION_COLLAPSED} />);
    expect(Accordion.Container).toBeVisible();
    expect(Accordion.ToggleButton).toBeVisible();
    expect(getScenarioActionsButtons()).toBeVisible();
    expect(getTabsWrapper()).not.toBeVisible();
    fireEvent.click(Accordion.ToggleButton);
    expect(mockOnToggleAccordion).toHaveBeenCalled();
  });

  it('checks accordion is expanded and prop function is called on click', async () => {
    customRender(<ScenarioParameters {...PROPS_WITH_ACCORDION_EXPANDED} />);
    expect(Accordion.Container).toBeVisible();
    expect(Accordion.ToggleButton).toBeVisible();
    expect(getScenarioActionsButtons()).toBeVisible();
    expect(getTabsWrapper()).toBeVisible();
    fireEvent.click(Accordion.ToggleButton);
    expect(mockOnToggleAccordion).toHaveBeenCalled();
  });
});
