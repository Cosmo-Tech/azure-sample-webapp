// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import rfdc from 'rfdc';
import { Login, ScenarioManager, Scenarios, ScenarioSelector } from '../../commons/actions';
import { API_REGEX } from '../../commons/constants/generic/TestConstants';
import { stub } from '../../commons/services/stubbing';
import { DEFAULT_SIMULATION_RUNNER } from '../../fixtures/stubbing/default';

const clone = rfdc();

// Scenario hierarchy: SCENARIO_A (running) > SCENARIO_B > SCENARIO_C
const SCENARIO_A = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-deletetest001',
  name: 'Cypress Delete Test - Scenario A',
  parentId: null,
  rootId: null,
  lastRunInfo: { lastRunId: 'run-deletetest001', lastRunStatus: 'Running' },
};

const SCENARIO_B = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-deletetest002',
  name: 'Cypress Delete Test - Scenario B',
  parentId: SCENARIO_A.id,
  rootId: SCENARIO_A.id,
};

const SCENARIO_C = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-deletetest003',
  name: 'Cypress Delete Test - Scenario C',
  parentId: SCENARIO_B.id,
  rootId: SCENARIO_A.id,
};

const ALL_SCENARIOS = [SCENARIO_A, SCENARIO_B, SCENARIO_C];
describe('Delete scenario batch button', () => {
  before(() => stub.start());
  afterEach(() => stub.reset());
  after(() => stub.stop());

  beforeEach(() => {
    stub.setRunners(clone(ALL_SCENARIOS));
    Login.login();
  });

  it('should not delete the scenarios and not trigger any API query when the deletion is canceled', () => {
    cy.intercept({ method: 'GET', url: API_REGEX.RUNNERS }).as('unexpectedGetRequest');
    cy.intercept({ method: 'DELETE', url: API_REGEX.RUNNERS }).as('unexpectedDeleteRequest');
    ScenarioSelector.selectScenario(SCENARIO_A.name, SCENARIO_A.id);

    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioRows().should('have.length', 3);
    ScenarioManager.getBatchDeleteButton().should('be.visible').should('be.disabled');
    ScenarioManager.toggleScenarioCheckboxes(ALL_SCENARIOS.map((scenario) => scenario.id));
    ScenarioManager.getBatchDeleteButton().should('not.be.disabled');
    ScenarioManager.clickBatchDeleteButton();

    // Check confirmation dialog content
    ScenarioManager.getScenarioDeleteDialogItems().should('have.length', 3);
    ALL_SCENARIOS.forEach((scenario) => ScenarioManager.getScenarioDeleteDialogBody().contains(scenario.name));

    ScenarioManager.clickDeleteCancelButton();
    ScenarioManager.getScenarioEditionDialogCancelButton().should('not.exist');
    cy.get('@unexpectedGetRequest.all').should('have.length', 0);
    cy.get('@unexpectedDeleteRequest.all').should('have.length', 0);
    ScenarioManager.getScenarioRows().should('have.length', 3);

    Scenarios.switchToScenarioView();
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO_A.name);
  });

  it('should remove the deleted scenarios from both views when the deletion is confirmed', () => {
    // Single-scenario deletion via row action menu
    ScenarioSelector.selectScenario(SCENARIO_C.name, SCENARIO_C.id);
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioRows().should('have.length', 3);
    ScenarioManager.deleteScenario(SCENARIO_C.id);
    ScenarioManager.getScenarioRows().should('have.length', 2);

    Scenarios.switchToScenarioView();
    ScenarioSelector.getScenarioSelectorInput().click({ force: true });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO_A.name);
    ScenarioSelector.getScenarioSelectorOption(SCENARIO_C.id).should('not.exist');

    // Multiple-scenario deletion (including one running scenario) via batch delete button
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioRows().should('have.length', 2);
    const scenariosToDelete = [SCENARIO_A.id, SCENARIO_B.id];
    const runningScenarios = [SCENARIO_A.id];
    ScenarioManager.deleteScenarioList(scenariosToDelete, runningScenarios);
    ScenarioManager.getScenarioRows().should('have.length', 0);

    Scenarios.switchToScenarioView();
    ScenarioSelector.getScenarioSelectorInput().should('be.disabled');
    Scenarios.getDashboardAccordion().click();
    Scenarios.getDashboardPlaceholder().should('be.visible');
    Scenarios.getDashboardPlaceholder().should(
      'have.text',
      'You can create a scenario by clicking on the "CREATE" button'
    );
  });

  it('can delete scenarios one by one even if those that are running', () => {
    // Delete 1 running scenario with single scenario delete button
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioRows().should('have.length', 3);
    ScenarioManager.deleteScenario(SCENARIO_A.id, true); // Scenario is running
    ScenarioManager.getScenarioRows().should('have.length', 2);

    // Delete 1 scenario with batch button
    ScenarioManager.deleteScenarioList([SCENARIO_B.id]);
    ScenarioManager.getScenarioRows().should('have.length', 1);
  });
});
