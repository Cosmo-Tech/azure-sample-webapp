// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { Login, ScenarioParameters, Scenarios } from '../../commons/actions';
import { RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { SCENARIO_RUN_IN_PROGRESS } from '../../commons/constants/generic/TestConstants';
import { stub } from '../../commons/services/stubbing';
import { MAIN_DATASET } from '../../fixtures/stubbing/default';

describe('checks the placeholder text before and while running', () => {
  const scenario = 'Test Cypress - Placeholder - ' + utils.randomStr(7);
  const runOptions = { runDuration: 5000, finalStatus: 'Successful', expectedPollsCount: 2 };

  before(() => stub.start());
  beforeEach(() => Login.login());
  after(() => stub.stop());

  it('checks the placeholder before running, launches scenario and checks the placeholder and launch button', () => {
    Scenarios.createScenario(scenario, true, MAIN_DATASET.name, RUN_TEMPLATE.BREWERY_PARAMETERS);
    Scenarios.getDashboardPlaceholder().should('not.be.visible');
    Scenarios.getDashboardAccordion().click();
    Scenarios.getDashboardPlaceholder().should('be.visible');
    Scenarios.getDashboardPlaceholder().should('have.text', 'The scenario has not been run yet');
    ScenarioParameters.launch({ runOptions, saveAndLaunch: true });
    Scenarios.getDashboardPlaceholder().should('have.text', SCENARIO_RUN_IN_PROGRESS);
    ScenarioParameters.getLaunchButton().should('not.exist');
    ScenarioParameters.getStopScenarioRunButton().should('exist');
  });
});
