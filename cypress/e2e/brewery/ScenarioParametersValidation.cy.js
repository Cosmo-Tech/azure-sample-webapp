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
const commentValue = utils.randomStr(0).repeat(4);

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
      ScenarioParameters.getTabsErrorBadge(BreweryParameters.getBasicTypesTab()).contains('0');
      BreweryParameters.getStockInput().clear();
      BreweryParameters.getStockInput().blur();
      BreweryParameters.getStockInput().should('value', '');
      BreweryParameters.getStockHelperText().should('be.visible').contains('required');
      ScenarioParameters.getTabsErrorBadge(BreweryParameters.getBasicTypesTab()).contains('1');
      BreweryParameters.getStockInput().type('5.12');
      BreweryParameters.getStockInput().blur();
      BreweryParameters.getStockHelperText().should('be.visible').contains('integer');
      BreweryParameters.getRestockInput().clear();
      BreweryParameters.getRestockInput().blur();
      BreweryParameters.getRestockInput().should('value', '');
      BreweryParameters.getRestockHelperText().should('be.visible').contains('required');
      ScenarioParameters.getTabsErrorBadge(BreweryParameters.getBasicTypesTab()).contains('2');
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
  it(
    'checks error message for date input when given value exceeds minimum and maximum value ' +
      'or expected format is not respected',
    () => {
      ScenarioParameters.expandParametersAccordion();

      BreweryParameters.switchToAdditionalParametersTab();

      ScenarioParameters.getInputValue(BreweryParameters.getStartDateInput()).as('start_date');
      ScenarioParameters.getInputValue(BreweryParameters.getAdditionalDateInput()).as('additional_date');

      BreweryParameters.getStartDateInput().clear();
      BreweryParameters.getStartDateHelperText().should('be.visible').contains('required');
      BreweryParameters.getStartDateInput().type('22/22/2222');
      BreweryParameters.getStartDateHelperText().should('be.visible').contains('format');
      BreweryParameters.getStartDateInput().clear().type('05/18/2099');
      BreweryParameters.getStartDateHelperText().should('not.exist');

      BreweryParameters.getAdditionalDateInput().clear().type('05/05/2018');
      BreweryParameters.getAdditionalDateHelperText().should('exist').contains('Minimum date');
      BreweryParameters.getAdditionalDateInput().clear().type('05/05/2024');
      BreweryParameters.getAdditionalDateHelperText().should('exist').contains('Maximum date');

      BreweryParameters.getAdditionalDateInput().clear().type('12/31/2020');
      BreweryParameters.getAdditionalDateHelperText().should('exist').contains('Minimum date');
      BreweryParameters.getAdditionalDateInput().clear().type('01/01/2023');
      BreweryParameters.getAdditionalDateHelperText().should('exist').contains('Maximum date');

      ScenarioParameters.getSaveButton().should('be.disabled');
      ScenarioParameters.getLaunchButton().should('be.disabled');

      BreweryParameters.switchToDatasetPartsTab();
      ScenarioParameters.getSaveButton().should('be.disabled');
      ScenarioParameters.getLaunchButton().should('be.disabled');

      BreweryParameters.switchToAdditionalParametersTab();
      BreweryParameters.getAdditionalDateHelperText().should('exist').contains('Maximum date');
      ScenarioParameters.discard();

      cy.get('@start_date').then((input) => {
        BreweryParameters.getStartDateInput().should('value', input);
      });
      cy.get('@additional_date').then((input) => {
        BreweryParameters.getAdditionalDateInput().should('value', input);
      });
      BreweryParameters.getAdditionalDateHelperText().should('not.exist');
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
    BreweryParameters.getCommentInput().type(commentValue, { delay: 10 });
    BreweryParameters.getCommentHelperText().should('exist').contains('Maximum length');
    BreweryParameters.getCurrencyNameInput().clear().type(currencyValueLong, { delay: 10 });
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
