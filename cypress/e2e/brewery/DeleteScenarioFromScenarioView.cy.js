// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, Scenarios, ScenarioSelector } from '../../commons/actions';
import { API_REGEX } from '../../commons/constants/generic/TestConstants';
import { stub } from '../../commons/services/stubbing';
import { DEFAULT_SIMULATION_RUNNER } from '../../fixtures/stubbing/default';

// Scenario hierarchy: SCENARIO_A > SCENARIO_B > SCENARIO_C
const SCENARIO_A = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-deletetest001',
  name: 'Cypress Delete Test - Scenario A',
  parentId: null,
  rootId: null,
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

const SCENARIO_A_RUNNING = {
  ...SCENARIO_A,
  lastRunInfo: { lastRunId: 'run-deletetest001', lastRunStatus: 'Running' },
};

describe('Delete scenario from Scenario view', () => {
  before(() => stub.start());
  afterEach(() => stub.reset());
  after(() => stub.stop());

  describe('Standard cases', () => {
    beforeEach(() => {
      stub.setRunners([SCENARIO_A, SCENARIO_B]);
      Login.login();
    });

    it('should delete the scenario and remove it from the selector when the deletion is confirmed', () => {
      ScenarioSelector.selectScenario(SCENARIO_A.name, SCENARIO_A.id);

      const validateRequest = (req) => expect(req.url).to.contain(SCENARIO_A.id);
      Scenarios.deleteCurrentScenario(SCENARIO_A, { validateRequest });

      ScenarioSelector.getScenarioSelectorInput().click({ force: true });
      ScenarioSelector.getScenarioSelectorOption(SCENARIO_A.id).should('not.exist');
    });

    it('should not delete the scenario and not trigger any API query when the deletion is canceled', () => {
      ScenarioSelector.selectScenario(SCENARIO_A.name, SCENARIO_A.id);
      cy.intercept({ method: 'GET', url: API_REGEX.RUNNERS }).as('unexpectedGetRequest');
      cy.intercept({ method: 'DELETE', url: API_REGEX.RUNNERS }).as('unexpectedDeleteRequest');

      Scenarios.getDeleteCurrentScenarioButton().should('be.visible').click();
      Scenarios.getDeleteCurrentScenarioDialogCancelButton().click();

      Scenarios.getDeleteCurrentScenarioDialogConfirmButton().should('not.exist');
      Scenarios.getScenarioLoadingSpinner().should('not.be.visible');
      cy.get('@unexpectedGetRequest.all').should('have.length', 0);
      cy.get('@unexpectedDeleteRequest.all').should('have.length', 0);

      ScenarioSelector.getScenarioSelectorInput().click({ force: true });
      ScenarioSelector.getScenarioSelectorOption(SCENARIO_A.id).should('be.visible');
    });
  });

  describe('Edge cases - running scenario', () => {
    beforeEach(() => {
      stub.setRunners([SCENARIO_A_RUNNING, SCENARIO_B]);
      Login.login();
    });

    it('can delete a running scenario', () => {
      const validateRequest = (req) => expect(req.url).to.contain(SCENARIO_A.id);
      ScenarioSelector.selectScenario(SCENARIO_A_RUNNING.name, SCENARIO_A_RUNNING.id);
      Scenarios.getDeleteCurrentScenarioButton().should('not.be.disabled');
      Scenarios.deleteCurrentScenario(SCENARIO_A_RUNNING, {
        validateRequest,
        validateStopRequest: validateRequest,
        isRunning: true,
      });
    });
  });

  describe('Edge cases - scenario hierarchy', () => {
    beforeEach(() => {
      stub.setRunners([SCENARIO_A, SCENARIO_B, SCENARIO_C]);
      Login.login();
    });

    it('deleting middle scenario B makes C a direct child of A', () => {
      ScenarioSelector.selectScenario(SCENARIO_B.name, SCENARIO_B.id);
      Scenarios.deleteCurrentScenario(SCENARIO_B);

      ScenarioSelector.getScenarioSelectorInput().click({ force: true });
      ScenarioSelector.getScenarioSelectorOption(SCENARIO_A.id).should('be.visible');
      ScenarioSelector.getScenarioSelectorOption(SCENARIO_B.id).should('not.exist');
      ScenarioSelector.getScenarioSelectorOption(SCENARIO_C.id).should('be.visible');
    });

    it('deleting root scenario A makes B a root scenario', () => {
      ScenarioSelector.selectScenario(SCENARIO_A.name, SCENARIO_A.id);
      const validateRequest = (req) => expect(req.url).to.contain(SCENARIO_A.id);
      Scenarios.deleteCurrentScenario(SCENARIO_A, { validateRequest });

      ScenarioSelector.getScenarioSelectorInput().click({ force: true });
      ScenarioSelector.getScenarioSelectorOption(SCENARIO_A.id).should('not.exist');
      ScenarioSelector.getScenarioSelectorOption(SCENARIO_B.id).should('be.visible');

      // SCENARIO_B should now be auto-selected as the new first root after deletion
      ScenarioSelector.getScenarioSelectorInput().type('{esc}');
      ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO_B.name);
    });
  });

  describe('Edge case - empty workspace after deletion', () => {
    beforeEach(() => {
      stub.setRunners([SCENARIO_A]);
      Login.login();
    });

    it('shows the empty workspace placeholder after deleting the last scenario', () => {
      ScenarioSelector.selectScenario(SCENARIO_A.name, SCENARIO_A.id);
      Scenarios.deleteCurrentScenario(SCENARIO_A, { waitSpinner: false });

      ScenarioSelector.getScenarioSelectorInput().should('be.disabled');
      Scenarios.getDashboardAccordion().click();
      Scenarios.getDashboardPlaceholder().should('be.visible');
      Scenarios.getDashboardPlaceholder().should(
        'have.text',
        'You can create a scenario by clicking on the "CREATE" button'
      );
    });
  });
});
