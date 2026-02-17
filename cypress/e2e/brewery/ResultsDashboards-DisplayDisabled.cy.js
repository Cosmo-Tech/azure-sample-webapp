// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, ScenarioParameters, Scenarios } from '../../commons/actions';
import { getDashboardsTab } from '../../commons/actions/generic/Dashboards';
import { stub } from '../../commons/services/stubbing';
import { WORKSPACE_WITHOUT_DASHBOARDS } from '../../fixtures/stubbing/ScenarioViewDashboard/workspace';
import { DEFAULT_RUNNERS } from '../../fixtures/stubbing/default';

const { id: scenarioId } = DEFAULT_RUNNERS[0];
const runOptions = {
  runDuration: 1000,
  finalStatus: 'Successful',
  expectedPollsCount: 2,
};

describe('results display is disabled', () => {
  before(() => {
    stub.start();
    stub.setWorkspaces([WORKSPACE_WITHOUT_DASHBOARDS]);
  });

  beforeEach(() => {
    Login.login({ isPowerBiEnabled: false });
  });

  after(() => {
    stub.stop();
  });

  it('can launch a scenario and show Display of results is disabled dashboard', () => {
    getDashboardsTab().should('not.exist');
    const saveAndLaunch = false; // No "update runner" query to intercept because there are no scenario parameters
    ScenarioParameters.launch({ scenarioId, runOptions, saveAndLaunch });
    ScenarioParameters.waitForScenarioRunEnd();
    Scenarios.getDashboardAccordionLogsDownloadButton().should('be.visible');
    Scenarios.getDashboardAccordion().click();
    Scenarios.getDashboardPlaceholder().should('be.visible');
    Scenarios.getDashboardPlaceholder().should(
      'have.text',
      'Scenario run was successful but the display of results is disabled'
    );
  });
});
