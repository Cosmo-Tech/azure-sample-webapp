// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import utils from '../../commons/TestUtils';
import { DATASET, RUN_TEMPLATE, SCENARIO_STATUS } from '../../commons/constants/brewery/TestConstants';
import { Scenarios, ScenarioManager, ScenarioParameters } from '../../commons/actions';
import { Login } from '../../commons/actions/brewery';

describe('Create scenario and check its data in scenario manager', () => {
  Cypress.Keyboard.defaults({
    keystrokeDelay: 0,
  });

  const runTemplate = RUN_TEMPLATE.BASIC_TYPES;

  function forgeScenarioName() {
    const prefix = 'Test Cypress scenario manager - ';
    const randomString = utils.randomStr(7);
    return prefix + randomString;
  }

  const scenarioNamesToDelete = [];

  before(() => {
    Login.login();
  });

  beforeEach(() => {
    Login.relogin();
  });

  after(() => {
    ScenarioManager.deleteScenarioList(scenarioNamesToDelete);
  });

  function _formatDate(date) {
    return new Date(date).toLocaleString();
  }

  it('Check scenario in scenario manager', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);

    Scenarios.createScenario(scenarioName, true, DATASET.BREWERY_ADT, runTemplate).then((value) => {
      const scenarioId = value.scenarioCreatedId;
      const scenarioOwnerName = value.scenarioCreatedOwnerName;
      const scenarioCreationDate = value.scenarioCreatedCreationDate;

      ScenarioManager.switchToScenarioManager();

      // FIX TEMP for https://cosmo-tech.atlassian.net/browse/PROD-11566
      // Remove this for test the fix.
      ScenarioManager.writeInFilter(scenarioName);

      ScenarioManager.getScenarioAccordion(scenarioId).click();
      ScenarioManager.getScenarioOwnerName(scenarioId).should('have.text', scenarioOwnerName);
      ScenarioManager.getScenarioCreationDate(scenarioId).should('have.text', _formatDate(scenarioCreationDate));
      ScenarioManager.getScenarioEditableLabel(scenarioId).should('have.text', scenarioName);
      ScenarioManager.getScenarioRunStatus(scenarioId, SCENARIO_STATUS.CREATED);
      ScenarioManager.getScenarioDataset(scenarioId).should('have.text', DATASET.BREWERY_ADT, { matchCase: false });

      Scenarios.switchToScenarioView();

      ScenarioParameters.launch();

      ScenarioManager.switchToScenarioManager();

      ScenarioManager.getScenarioAccordion(scenarioId).click();
      ScenarioManager.getScenarioRunStatus(scenarioId, SCENARIO_STATUS.RUNNING);
      ScenarioManager.getScenarioRunStatus(scenarioId, SCENARIO_STATUS.SUCCESSFUL, 300);
    });
  });
});
