// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { stub } from '../../commons/services/stubbing';
import { Login, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { SCENARIOS, SOLUTIONS } from '../../fixtures/stubbing/ScenarioParametersValidation';

describe('scenario parameters inputs validation', () => {
  before(() => {
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
    stub.setSolutions(SOLUTIONS);
    stub.setScenarios(SCENARIOS);
  });

  beforeEach(() => {
    Login.relogin();
  });

  it(
    'clears number input, checks required value error message, Save and Launch buttons, ' +
      'changes tab and checks that Save and Launch buttons are still disabled',
    () => {
      ScenarioParameters.expandParametersAccordion();
      ScenarioParameters.getInputValue(BreweryParameters.getRestockInput()).as('restock');
      BreweryParameters.getRestockInput().click().clear();
      BreweryParameters.getRestockInput().blur();
      BreweryParameters.getRestockInput().should('value', '');
      BreweryParameters.getRestockHelperText().should('be.visible').contains('required');
      ScenarioParameters.getSaveButton().should('be.disabled');
      ScenarioParameters.getLaunchButton().should('be.disabled');
      BreweryParameters.switchToDatasetPartsTab();
      ScenarioParameters.getSaveButton().should('be.disabled');
      ScenarioParameters.getLaunchButton().should('be.disabled');

      BreweryParameters.switchToDatasetPartsTab();
      ScenarioParameters.getSaveButton().should('be.disabled');
      ScenarioParameters.getLaunchButton().should('be.disabled');
      BreweryParameters.switchToBasicTypesTab();
      BreweryParameters.getRestockHelperText().should('be.visible').contains('required');
      ScenarioParameters.discard();

      cy.get('@restock').then((input) => {
        BreweryParameters.getRestockInput().should('value', input);
      });
    }
  );
  it(
    'checks required and int varType error messages for int varType ' +
      "and checks that int error message isn't displayed for number varType",
    () => {
      ScenarioParameters.getInputValue(BreweryParameters.getStockInput()).as('stock');
      ScenarioParameters.getInputValue(BreweryParameters.getRestockInput()).as('restock');

      ScenarioParameters.expandParametersAccordion();
      BreweryParameters.getStockInput().clear();
      BreweryParameters.getStockInput().blur();
      BreweryParameters.getStockInput().should('value', '');
      BreweryParameters.getStockHelperText().should('be.visible').contains('required');
      BreweryParameters.getStockInput().type('5.12');
      BreweryParameters.getStockInput().blur();
      BreweryParameters.getStockHelperText().should('be.visible').contains('integer');
      BreweryParameters.getRestockInput().clear();
      BreweryParameters.getRestockInput().blur();
      BreweryParameters.getRestockInput().should('value', '');
      BreweryParameters.getRestockHelperText().should('be.visible').contains('required');
      BreweryParameters.getRestockInput().type('5.12');
      BreweryParameters.getRestockInput().blur();
      BreweryParameters.getRestockHelperText().should('not.exist');

      ScenarioParameters.getSaveButton().should('be.disabled');
      ScenarioParameters.getLaunchButton().should('be.disabled');
      ScenarioParameters.discard();

      cy.get('@stock').then((input) => {
        BreweryParameters.getStockInput().should('value', input);
      });
      cy.get('@restock').then((input) => {
        BreweryParameters.getRestockInput().should('value', input);
      });
    }
  );
});
