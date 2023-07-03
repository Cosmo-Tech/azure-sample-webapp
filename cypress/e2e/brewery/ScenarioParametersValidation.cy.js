// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { stub } from '../../commons/services/stubbing';
import { Login, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { SCENARIOS, SOLUTIONS } from '../../fixtures/stubbing/ScenarioParametersValidation';
import utils from '../../commons/TestUtils';

const currencyValueShort = 'E';
const currencyValueLong = utils.randomStr(1);
const evaluationValue = 'G';
const commentValue = utils.randomStr(0).repeat(3);

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
    stub.setSolutions(SOLUTIONS);
    stub.setScenarios(SCENARIOS);
  });

  beforeEach(() => {
    Login.login();
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
  it('checks min and max length validation for string varType', () => {
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToDatasetPartsTab();
    ScenarioParameters.getInputValue(BreweryParameters.getCurrencyNameInput()).as('currency_name');
    ScenarioParameters.getInputValue(BreweryParameters.getEvaluationInput()).as('evaluation');
    ScenarioParameters.getInputValue(BreweryParameters.getCommentInput()).as('comment');

    BreweryParameters.getCurrencyNameInput().clear();
    BreweryParameters.getCurrencyNameHelperText().should('be.visible').contains('required');
    BreweryParameters.getEvaluationInput().clear().type(evaluationValue);
    BreweryParameters.getEvaluationHelperText().should('be.visible').contains('Minimum length');
    BreweryParameters.getCommentInput().clear();
    BreweryParameters.getCommentHelperText().should('not.exist');

    ScenarioParameters.getSaveButton().should('be.disabled');
    ScenarioParameters.getLaunchButton().should('be.disabled');

    BreweryParameters.switchToBasicTypesTab();

    ScenarioParameters.getSaveButton().should('be.disabled');
    ScenarioParameters.getLaunchButton().should('be.disabled');

    BreweryParameters.switchToDatasetPartsTab();

    BreweryParameters.getCurrencyNameInput().type(currencyValueShort);
    BreweryParameters.getCurrencyNameHelperText().should('exist').contains('Minimum length');
    BreweryParameters.getCommentInput().type(commentValue);
    BreweryParameters.getCommentHelperText().should('exist').contains('Maximum length');
    BreweryParameters.getCurrencyNameInput().clear().type(currencyValueLong);
    BreweryParameters.getCurrencyNameHelperText().should('exist').contains('Maximum length');
    ScenarioParameters.discard();
    cy.get('@currency_name').then((input) => {
      BreweryParameters.getCurrencyNameInput().should('value', input);
    });
    cy.get('@comment').then((input) => {
      BreweryParameters.getCommentInput().should('value', input);
    });
    cy.get('@evaluation').then((input) => {
      BreweryParameters.getEvaluationInput().should('value', input);
    });
  });
  it('checks error messages for min and max values in number input', () => {
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.getStockInput().clear().type('150');
    BreweryParameters.getStockHelperText().should('be.visible').contains('Maximum value');
    BreweryParameters.getStockInput().clear().type('-150');
    BreweryParameters.getStockHelperText().should('be.visible').contains('Minimum value');
    BreweryParameters.getRestockInput().clear().type('30');
    BreweryParameters.getRestockHelperText().should('be.visible').contains('Maximum value');
    BreweryParameters.getRestockInput().clear().type('-30');
    BreweryParameters.getRestockHelperText().should('not.exist');
    BreweryParameters.getWaitersInput().clear().type('-5');
    BreweryParameters.getWaitersHelperText().should('be.visible').contains('Minimum value');
    BreweryParameters.getWaitersInput().clear().type('25');
    BreweryParameters.getWaitersHelperText().should('not.exist');
    ScenarioParameters.getSaveButton().should('be.disabled');
    ScenarioParameters.getLaunchButton().should('be.disabled');
    BreweryParameters.getStockInput().clear().type('50');
    BreweryParameters.getStockHelperText().should('not.exist');
    ScenarioParameters.getSaveButton().should('not.be.disabled');
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.discard();
  });
});
