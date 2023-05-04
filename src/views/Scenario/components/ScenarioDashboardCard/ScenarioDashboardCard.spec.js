// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import ScenarioDashboardCard from '.';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { customRender } from '../../../../../tests/utils/renderInThemeAndStoreProviders';
import { AccordionTesting } from '../../../../../tests/MuiComponentsTesting/AccordionTesting';

jest.mock('../index', () => ({
  __esModule: true,
  ScenarioPowerBiReport: () => {
    return <div data-testid="scenario-powerbi-report" />;
  },
}));

const Accordion = new AccordionTesting({ dataCy: 'dashboards-accordion' });
const getDashboard = () => screen.getByTestId('scenario-powerbi-report');

describe('test Scenario dashboard accordion', () => {
  it('unfolds and folds scenario dashboard card', async () => {
    customRender(<ScenarioDashboardCard />);
    expect(Accordion.Container).toBeVisible();
    expect(Accordion.ToggleButton).toBeVisible();
    expect(getDashboard()).not.toBeVisible();
    fireEvent.click(Accordion.ToggleButton);
    expect(getDashboard()).toBeVisible();
    fireEvent.click(Accordion.ToggleButton);
    await waitFor(() => expect(getDashboard()).not.toBeVisible());
  });
});
