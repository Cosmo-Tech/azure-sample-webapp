// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import utils from '../../commons/TestUtils';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { Scenarios, ScenarioManager, ScenarioParameters, Login } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { setup } from '../../commons/utils/setup';

const SCENARIO_DATASET = DATASET.BREWERY_ADT;
const SCENARIO_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;

describe('Scenario validation', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start({
      AUTHENTICATION: true,
      CREATE_AND_DELETE_SCENARIO: true,
      GET_DATASETS: true,
      GET_SCENARIOS: true,
      GET_SOLUTIONS: true,
      GET_WORKSPACES: true,
      UPDATE_SCENARIO: true,
    });
    Login.login();
  });

  beforeEach(() => {
    stub.setFakeWorkspaceId('W-stbbdbrwry');
    Login.relogin();
  });

  it('can validate & reject scenarios', () => {
    let scenarioId;
    const prefix = 'Test Cypress - Scenario validation - ';
    const randomString = utils.randomStr(7);
    const scenarioName = prefix + randomString;
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE).then((value) => {
      scenarioId = value.scenarioCreatedId;

      // Default status - Draft or Unknown
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
      Scenarios.validateScenario(scenarioId);
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
      Scenarios.resetScenarioValidationStatus(scenarioId);
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
      Scenarios.rejectScenario(scenarioId);
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
      Scenarios.resetScenarioValidationStatus(scenarioId);
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
