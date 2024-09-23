// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { Scenarios, ScenarioManager, ScenarioParameters, Login } from '../../commons/actions';
import { RUN_TEMPLATE, SCENARIO_STATUS } from '../../commons/constants/brewery/TestConstants';
import { FAILED_SCENARIO_RUN, SCENARIO_RUN_IN_PROGRESS } from '../../commons/constants/generic/TestConstants';
import { stub } from '../../commons/services/stubbing';
import { DEFAULT_DATASETS_LIST } from '../../fixtures/stubbing/default';

const firstScenarioName = 'Test Cypress - Cancel run - ' + utils.randomStr(7);
const secondScenarioName = 'Test Cypress - delete during run - ' + utils.randomStr(7);
const runOptions = {
  runDuration: 5000,
  finalStatus: 'Successful',
  expectedPollsCount: 2,
};
describe('can cancel simulation run', () => {
  before(() => {
    stub.start();
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('creates scenario, launches it and cancels the simulation run', () => {
    Scenarios.createScenario(firstScenarioName, true, DEFAULT_DATASETS_LIST[0].name, RUN_TEMPLATE.BREWERY_PARAMETERS);
    ScenarioParameters.launch({ runOptions, saveAndLaunch: true });
    Scenarios.getDashboardAccordion().click();
    Scenarios.getDashboardPlaceholder().should('have.text', SCENARIO_RUN_IN_PROGRESS);
    ScenarioParameters.getLaunchButton(15).should('not.exist');
    ScenarioParameters.getStopScenarioRunButton().should('be.visible');
    ScenarioParameters.cancelRun(false);
    ScenarioParameters.getLaunchButton().should('not.exist');
    Scenarios.getDashboardAccordion().click();
    Scenarios.getDashboardPlaceholder().should('have.text', SCENARIO_RUN_IN_PROGRESS);
    Scenarios.getDashboardAccordion().click();
    ScenarioParameters.cancelRun();
    ScenarioParameters.getStopScenarioRunButton().should('not.exist');
    ScenarioParameters.getLaunchButton().should('be.visible');
    Scenarios.getDashboardPlaceholder().should('have.text', FAILED_SCENARIO_RUN);
  });
});

describe('can cancel simulation run before delete', () => {
  before(() => {
    stub.start();
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('create scenario, launch it and delete it during it is running', () => {
    ScenarioParameters.expandParametersAccordion();
    Scenarios.createScenario(
      secondScenarioName,
      true,
      DEFAULT_DATASETS_LIST[0].name,
      RUN_TEMPLATE.BREWERY_PARAMETERS
    ).then((value) => {
      const scenarioId = value.scenarioCreatedId;
      ScenarioParameters.launch({ runOptions, saveAndLaunch: true });
      ScenarioManager.switchToScenarioManager();
      ScenarioManager.getScenarioAccordion(scenarioId).click();
      ScenarioManager.getScenarioRunStatus(scenarioId, SCENARIO_STATUS.RUNNING);
      ScenarioManager.deleteScenario(secondScenarioName, true);
    });
  });
});
