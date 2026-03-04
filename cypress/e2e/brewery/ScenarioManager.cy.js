// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, Scenarios, ScenarioManager, ScenarioParameters, ErrorBanner } from '../../commons/actions';
import { SCENARIO_STATUS } from '../../commons/constants/brewery/TestConstants';
import { stub } from '../../commons/services/stubbing';
import { setup } from '../../commons/utils';
import { DEFAULT_RUNNER_BASE_DATASET, BASIC_PARAMETERS_SIMULATION_RUNNER } from '../../fixtures/stubbing/default';

describe('Create scenario and check its data in scenario manager', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start();
    stub.setRunners([BASIC_PARAMETERS_SIMULATION_RUNNER]);
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  function _formatDate(date) {
    return new Date(date).toLocaleString();
  }

  it('Check scenario in scenario manager', () => {
    const scenarioId = BASIC_PARAMETERS_SIMULATION_RUNNER.id;
    const scenarioName = BASIC_PARAMETERS_SIMULATION_RUNNER.name;
    const scenarioOwnerName = BASIC_PARAMETERS_SIMULATION_RUNNER.additionalData.webapp.ownerName;
    const scenarioCreationDate = BASIC_PARAMETERS_SIMULATION_RUNNER.createInfo.timestamp;
    const scenarioRunTemplate = BASIC_PARAMETERS_SIMULATION_RUNNER.runTemplateName;
    const runOptions = {
      runDuration: 1000,
      finalStatus: 'Successful',
      expectedPollsCount: 2,
    };

    ScenarioManager.switchToScenarioManager();
    // FIX TEMP for https://cosmo-tech.atlassian.net/browse/PROD-11566
    // Remove this for test the fix.
    ErrorBanner.dismissErrorIfVisible();

    ScenarioManager.getScenarioAccordion(scenarioId).click();
    ScenarioManager.getScenarioOwnerName(scenarioId).should('have.text', scenarioOwnerName);
    ScenarioManager.getScenarioCreationDate(scenarioId).should('have.text', _formatDate(scenarioCreationDate));
    ScenarioManager.getScenarioEditableLink(scenarioId).should('have.text', scenarioName);
    ScenarioManager.getScenarioRunStatus(scenarioId, SCENARIO_STATUS.CREATED);
    ScenarioManager.getScenarioRunTemplate(scenarioId).should('have.text', scenarioRunTemplate);
    ScenarioManager.getScenarioDataset(scenarioId).should('have.text', DEFAULT_RUNNER_BASE_DATASET.name, {
      matchCase: false,
    });

    Scenarios.switchToScenarioView();
    ScenarioParameters.launch({ scenarioId, runOptions, saveAndLaunch: true });
    ScenarioManager.switchToScenarioManager();

    // FIX TEMP for https://cosmo-tech.atlassian.net/browse/PROD-11566
    // Remove this for test the fix.
    ErrorBanner.dismissErrorIfVisible();
    ScenarioManager.getScenarioAccordion(scenarioId).click();
    ScenarioManager.getScenarioRunStatus(scenarioId, SCENARIO_STATUS.RUNNING);
    ScenarioManager.getScenarioRunStatus(scenarioId, SCENARIO_STATUS.SUCCESSFUL, 500);
  });
});
