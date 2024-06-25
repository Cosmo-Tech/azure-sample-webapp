// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, Scenarios, ScenarioManager, ScenarioParameters, ErrorBanner } from '../../commons/actions';
import { DATASET, SCENARIO_STATUS } from '../../commons/constants/brewery/TestConstants';
import { stub } from '../../commons/services/stubbing';
import { setup } from '../../commons/utils';
import { DEFAULT_SCENARIOS_LIST } from '../../fixtures/stubbing/default';

describe('Create scenario and check its data in scenario manager', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start({
      CREATE_AND_DELETE_SCENARIO: true,
      GET_DATASETS: true,
      GET_SOLUTIONS: true,
      GET_WORKSPACES: true,
      GET_ORGANIZATION: true,
      GET_SCENARIOS: true,
      LAUNCH_SCENARIO: true,
      PERMISSIONS_MAPPING: true,
      UPDATE_SCENARIO: true,
    });
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
    const scenarioId = DEFAULT_SCENARIOS_LIST[0].id;
    const scenarioName = DEFAULT_SCENARIOS_LIST[0].name;
    const scenarioOwnerName = DEFAULT_SCENARIOS_LIST[0].ownerName;
    const scenarioCreationDate = DEFAULT_SCENARIOS_LIST[0].creationDate;
    const scenarioRunTemplate = DEFAULT_SCENARIOS_LIST[0].runTemplateName;
    const runOptions = {
      runDuration: 1000,
      dataIngestionDuration: 1000,
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
    ScenarioManager.getScenarioDataset(scenarioId).should('have.text', DATASET.BREWERY_ADT, { matchCase: false });

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
