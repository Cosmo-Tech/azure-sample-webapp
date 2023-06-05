// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { stub } from '../../commons/services/stubbing';
import { Login, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';

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
  });
  it('can clear number input, checks error message and Save and Launch buttons', () => {
    ScenarioParameters.expandParametersAccordion();
    ScenarioParameters.getInputValue(BreweryParameters.getCurrencyValueInput()).as('currency-value');
    BreweryParameters.getCurrencyValueInput().click().clear();
    BreweryParameters.getCurrencyValueInput().blur();
    BreweryParameters.getCurrencyValueInput().should('value', '');
    BreweryParameters.getCurrencyValueHelperText().should('be.visible');
    ScenarioParameters.getSaveButton().should('be.disabled');
    ScenarioParameters.getLaunchButton().should('be.disabled');
    BreweryParameters.switchToDatasetPartsTab();
    ScenarioParameters.getSaveButton().should('be.disabled');
    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioParameters.discard();
    BreweryParameters.switchToBasicTypesTab();
    cy.get('@currency-value').then((input) => {
      BreweryParameters.getCurrencyValueInput().should('value', input);
    });
  });
});
