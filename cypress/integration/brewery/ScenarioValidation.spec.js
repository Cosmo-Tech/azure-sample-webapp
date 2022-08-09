// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import utils from '../../commons/TestUtils';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { Scenarios, ScenarioManager, ScenarioParameters, Login } from '../../commons/actions';

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});

const SCENARIO_DATASET = DATASET.BREWERY_ADT;
const SCENARIO_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;

describe('Scenario validation', () => {
  before(() => {
    Login.login();
  });

  beforeEach(() => {
    Login.relogin();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    ScenarioManager.deleteScenarioList(scenarioNamesToDelete);
  });

  it('can validate & reject scenarios', () => {
    let scenarioId;
    const prefix = 'Test Cypress - Scenario validation - ';
    const randomString = utils.randomStr(7);
    const scenarioName = prefix + randomString;
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE).then((value) => {
      scenarioId = value.scenarioCreatedId;

      // Default status - Draft or Unknwo
      Scenarios.getScenarioValidationStatusChip().should('not.exist');
      Scenarios.getScenarioValidationStatusLoadingSpinner(10).should('not.exist');
      Scenarios.getScenarioValidateButton().should('be.visible').should('not.be.disabled');
      Scenarios.getScenarioRejectButton().should('be.visible').should('not.be.disabled');
      ScenarioParameters.getParametersEditButton().should('not.be.disabled');
      Scenarios.checkValidationStatusInScenarioSelector(scenarioName, scenarioId, 'Draft');
      ScenarioManager.switchToScenarioManager();
      ScenarioManager.checkValidationStatus(scenarioName, scenarioId, 'Draft');
      Scenarios.switchToScenarioView();

      // Validate scenario
      Scenarios.validateScenario();
      Scenarios.getScenarioValidationStatusLoadingSpinner().should('be.visible');
      Scenarios.getScenarioValidationStatusLoadingSpinner(10).should('not.exist');
      Scenarios.getScenarioValidationStatusChip().should('exist');
      Scenarios.getScenarioValidationStatusChip().should('have.text', 'Validated');
      Scenarios.getScenarioValidateButton().should('not.exist');
      Scenarios.getScenarioRejectButton().should('not.exist');
      ScenarioParameters.getParametersEditButton().should('be.disabled');
      Scenarios.checkValidationStatusInScenarioSelector(scenarioName, scenarioId, 'Validated');
      ScenarioManager.switchToScenarioManager();
      ScenarioManager.checkValidationStatus(scenarioName, scenarioId, 'Validated');
      Scenarios.switchToScenarioView();

      // Reset status to Draft
      Scenarios.resetScenarioValidationStatus();
      Scenarios.getScenarioValidationStatusLoadingSpinner().should('be.visible');
      Scenarios.getScenarioValidationStatusLoadingSpinner(10).should('not.exist');
      Scenarios.getScenarioValidationStatusChip().should('not.exist');
      Scenarios.getScenarioValidateButton().should('be.visible').should('not.be.disabled');
      Scenarios.getScenarioRejectButton().should('be.visible').should('not.be.disabled');
      ScenarioParameters.getParametersEditButton().should('not.be.disabled');
      Scenarios.checkValidationStatusInScenarioSelector(scenarioName, scenarioId, 'Draft');
      ScenarioManager.switchToScenarioManager();
      ScenarioManager.checkValidationStatus(scenarioName, scenarioId, 'Draft');
      Scenarios.switchToScenarioView();

      // Reject scenario
      Scenarios.rejectScenario();
      Scenarios.getScenarioValidationStatusLoadingSpinner().should('be.visible');
      Scenarios.getScenarioValidationStatusLoadingSpinner(10).should('not.exist');
      Scenarios.getScenarioValidationStatusChip().should('exist');
      Scenarios.getScenarioValidationStatusChip().should('have.text', 'Rejected');
      Scenarios.getScenarioValidateButton().should('not.exist');
      Scenarios.getScenarioRejectButton().should('not.exist');
      ScenarioParameters.getParametersEditButton().should('be.disabled');
      Scenarios.checkValidationStatusInScenarioSelector(scenarioName, scenarioId, 'Rejected');
      ScenarioManager.switchToScenarioManager();
      ScenarioManager.checkValidationStatus(scenarioName, scenarioId, 'Rejected');
      Scenarios.switchToScenarioView();

      // Reset status to Draft
      Scenarios.resetScenarioValidationStatus();
      Scenarios.getScenarioValidationStatusLoadingSpinner().should('be.visible');
      Scenarios.getScenarioValidationStatusLoadingSpinner(10).should('not.exist');
      Scenarios.getScenarioValidationStatusChip().should('not.exist');
      Scenarios.getScenarioValidateButton().should('be.visible');
      Scenarios.getScenarioRejectButton().should('be.visible');
      ScenarioParameters.getParametersEditButton().should('not.be.disabled');
      Scenarios.checkValidationStatusInScenarioSelector(scenarioName, scenarioId, 'Draft');
      ScenarioManager.switchToScenarioManager();
      ScenarioManager.checkValidationStatus(scenarioName, scenarioId, 'Draft');
      Scenarios.switchToScenarioView();
    });
  });
});
