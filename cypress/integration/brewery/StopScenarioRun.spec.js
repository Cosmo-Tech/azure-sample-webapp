// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Login } from '../../commons/actions/brewery';
import utils from '../../commons/TestUtils';
import { ScenarioManager, ScenarioParameters, Scenarios } from '../../commons/actions';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { FAILED_SCENARIO_RUN, SCENARIO_RUN_IN_PROGRESS } from '../../commons/constants/generic/TestConstants';

const scenario = 'Test Cypress - Cancel run - ' + utils.randomStr(7);
describe('can cancel simulation run', () => {
  before(() => {
    Login.login();
  });
  after(() => {
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.deleteScenario(scenario);
  });
  it('creates scenario, launches it and cancels the simulation run', () => {
    Scenarios.createScenario(scenario, true, DATASET.BREWERY_ADT, RUN_TEMPLATE.BREWERY_PARAMETERS);
    ScenarioParameters.getLaunchButton().click();
    Scenarios.getDashboardAccordion().click();
    Scenarios.getDashboardPlaceholder().should('have.text', SCENARIO_RUN_IN_PROGRESS);
    ScenarioParameters.getLaunchButton().should('not.exist');
    ScenarioParameters.getStopScenarioRunButton().should('exist');
    Scenarios.getDashboardAccordion().click();
    ScenarioParameters.cancelRun(false);
    ScenarioParameters.getLaunchButton().should('not.exist');
    Scenarios.getDashboardAccordion().click();
    Scenarios.getDashboardPlaceholder().should('have.text', SCENARIO_RUN_IN_PROGRESS);
    Scenarios.getDashboardAccordion().click();
    ScenarioParameters.cancelRun();
    ScenarioParameters.getStopScenarioRunButton().should('not.exist');
    ScenarioParameters.getLaunchButton().should('exist');
    Scenarios.getDashboardPlaceholder().should('have.text', FAILED_SCENARIO_RUN);
  });
});
