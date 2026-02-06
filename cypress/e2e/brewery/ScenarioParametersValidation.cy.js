// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { Login, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import {
  SCENARIOS,
  SOLUTIONS_WITH_CONSTRAINTS,
  SOLUTIONS,
  SOLUTIONS_WITH_WRONG_CONSTRAINT,
} from '../../fixtures/stubbing/ScenarioParametersValidation';

const currencyValueShort = 'E';
const currencyValueLong = utils.randomStr(15);
const evaluationValue = 'G';
const commentValue = utils.randomStr(10).repeat(4);
const invalidFormatFilePath = 'file_with_invalid_format.png';

describe('scenario parameters inputs validation', () => {
  before(() => {
    stub.start();
    stub.setSolutions(SOLUTIONS);
    stub.setRunners(SCENARIOS);
    stub.setScenarios(SCENARIOS);
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
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
      ScenarioParameters.getTabsErrorBadge(BreweryParameters.getBasicTypesTab()).should('not.be.visible');
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

      BreweryParameters.getStartDateInput().find('input').invoke('val').as('start_date');
      BreweryParameters.getAdditionalDateInput().invoke('val').as('additional_date');

      BreweryParameters.getStartDateInput().click();
      cy.focused().type('{selectAll}{backspace}', { delay: 1 });
      BreweryParameters.getStartDateHelperText().should('be.visible').contains('required');
      cy.focused().type('12/31/2000', { delay: 1 });
      BreweryParameters.getStartDateInput().find('input').should('have.value', '12/31/2000');
      BreweryParameters.getStartDateHelperText().should('not.exist');

      cy.get('[data-cy=date-input-additional_date]').find('[role="group"]').click();
      cy.focused().type('{selectAll}{backspace}', { delay: 1 });
      cy.focused().type('05/05/2018', { delay: 1 });
      BreweryParameters.getAdditionalDateInput().should('have.value', '05/05/2018');
      BreweryParameters.getAdditionalDateHelperText().should('exist').contains('Minimum date');

      cy.get('[data-cy=date-input-additional_date]').type('{leftArrow}{leftArrow}{selectAll}{backspace}05/05/2024', { delay: 1 });
      BreweryParameters.getAdditionalDateInput().should('have.value', '05/05/2024');
      BreweryParameters.getAdditionalDateHelperText().should('exist').contains('Maximum date');

      cy.get('[data-cy=date-input-additional_date]').type('{leftArrow}{leftArrow}{selectAll}{backspace}12/31/2020', { delay: 1 });
      BreweryParameters.getAdditionalDateInput().should('have.value', '12/31/2020');
      BreweryParameters.getAdditionalDateHelperText().should('exist').contains('Minimum date');

      cy.get('[data-cy=date-input-additional_date]').type('{leftArrow}{leftArrow}{selectAll}{backspace}01/01/2023', { delay: 1 });
      BreweryParameters.getAdditionalDateInput().should('have.value', '01/01/2023');
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
        BreweryParameters.getStartDateInput().find('input').should('have.value', input);
      });
      cy.get('@additional_date').then((input) => {
        BreweryParameters.getAdditionalDateInput().should('have.value', input);
      });
      BreweryParameters.getAdditionalDateHelperText().should('not.exist');
    }
  );
  //Evaluation field is required but also max length is 0
  it.skip('checks min and max length validation for string varType', () => {
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToDatasetPartsTab();
    ScenarioParameters.getInputValue(BreweryParameters.getCurrencyNameInput()).as('currency_name');
    ScenarioParameters.getInputValue(BreweryParameters.getEvaluationInput()).as('evaluation');
    ScenarioParameters.getInputValue(BreweryParameters.getCommentInput()).as('comment');

    BreweryParameters.getCurrencyNameInput().clear();
    BreweryParameters.getCurrencyNameHelperText().should('be.visible').contains('required');
    BreweryParameters.getEvaluationInput().clear();
    BreweryParameters.getEvaluationInput().should('have.value', '');
    BreweryParameters.getEvaluationInput().type(evaluationValue);
    BreweryParameters.getEvaluationInput().should('have.value', evaluationValue);
    BreweryParameters.getEvaluationInput().blur();
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

  it('checks error message for invalid file format in file upload input', () => {
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.getExampleDatasetPart2ErrorMessage().should('not.exist');
    ScenarioParameters.getTabsErrorBadge(BreweryParameters.getDatasetPartsTab()).should('not.be.visible');
    BreweryParameters.uploadExampleDatasetPart2(invalidFormatFilePath);
    BreweryParameters.getExampleDatasetPart2ErrorMessage().should('be.visible').contains('File format not supported');
    ScenarioParameters.getTabsErrorBadge(BreweryParameters.getDatasetPartsTab()).contains('1');
    ScenarioParameters.getSaveButton().should('be.disabled');
    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioParameters.discard();
    BreweryParameters.getExampleDatasetPart2ErrorMessage().should('not.exist');
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getTabsErrorBadge(BreweryParameters.getDatasetPartsTab()).should('not.be.visible');
  });
});

describe('validation with constraints between parameters', () => {
  before(() => {
    stub.start();
    stub.setSolutions(SOLUTIONS_WITH_CONSTRAINTS);
    stub.setRunners(SCENARIOS);
    stub.setScenarios(SCENARIOS);
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });
  //evaluation input is broken same as before broken
  it('checks validation constraints', () => {
    ScenarioParameters.expandParametersAccordion();

    BreweryParameters.getStockInput().clear().type('4');
    BreweryParameters.getRestockHelperText().should('exist').contains('strictly less than the field Stock');
    BreweryParameters.getRestockInput().clear().type('1');
    BreweryParameters.getRestockHelperText().should('not.exist');
    BreweryParameters.getWaitersHelperText().should('exist').contains('less than or equal to the field Restock');
    BreweryParameters.getWaitersInput().clear().type('1');
    BreweryParameters.getWaitersHelperText().should('not.exist');

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getStartDateInput().click();
    cy.focused().type('{selectAll}{backspace}', { delay: 1 });
    cy.focused().type('02/22/2022', { delay: 1 });
    cy.focused().blur();
    BreweryParameters.getEndDateHelperText().should('exist').contains('strictly after');
    BreweryParameters.getEndDateInput().click();
    cy.focused().type('{selectAll}{backspace}', { delay: 1 });
    cy.focused().type('02/26/2022', { delay: 1 });
    cy.focused().blur();
    BreweryParameters.getEndDateHelperText().should('not.exist');
    BreweryParameters.getEndDateInput().click();
    cy.focused().type('{selectAll}{backspace}', { delay: 1 });
    cy.focused().type('02/26/2021', { delay: 1 });
    cy.focused().blur();
    BreweryParameters.getEndDateHelperText().should('exist').contains('strictly after');
    BreweryParameters.getStartDateInput().click();
    cy.focused().type('{selectAll}{backspace}', { delay: 1 });
    cy.focused().type('02/22/2021', { delay: 1 });
    cy.focused().blur();
    BreweryParameters.getEndDateHelperText().should('not.exist');
    BreweryParameters.getEndDateInput().click();
    cy.focused().type('{selectAll}{backspace}', { delay: 1 });
    cy.focused().type('06/22/2022', { delay: 1 });
    cy.focused().blur();
    BreweryParameters.getAdditionalDateHelperText().should('exist').contains('must be different');
    ScenarioParameters.getSaveButton().should('be.disabled');
    ScenarioParameters.getLaunchButton().should('be.disabled');
    cy.get('[data-cy=date-input-additional_date]').find('[role="group"]').click();
    cy.focused().type('{selectAll}{backspace}', { delay: 1 });
    cy.focused().type('06/21/2022', { delay: 1 });
    cy.focused().blur();
    BreweryParameters.getAdditionalDateHelperText().should('not.exist');
    ScenarioParameters.discard();

    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.getCommentInput().clear().type('Good');
    BreweryParameters.getCommentInput().blur();
    BreweryParameters.getEvaluationHelperText().should('exist').contains('must be different from');
    BreweryParameters.getEvaluationInput().clear().type('Super');
    BreweryParameters.getEvaluationInput().blur();
    BreweryParameters.getEvaluationHelperText().should('not.exist');
    ScenarioParameters.discard();
  });
});

describe('validation constraint with wrong configuration', () => {
  before(() => {
    stub.start();
    stub.setSolutions(SOLUTIONS_WITH_WRONG_CONSTRAINT);
    stub.setRunners(SCENARIOS);
    stub.setScenarios(SCENARIOS);
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('checks error messages when there is an error in solution default values', () => {
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.getEndDateHelperText().should('exist').contains('strictly after');
    ScenarioParameters.getTabsErrorBadge(BreweryParameters.getBasicTypesTab()).contains('1');
    ScenarioParameters.getLaunchButton().should('be.disabled');
    BreweryParameters.getEndDateInput().find('[role="group"]').click();
    cy.focused().type('{selectAll}{backspace}', { delay: 1 });
    cy.focused().type('08/20/2014', { delay: 1 });
    ScenarioParameters.getSaveButton().should('exist').should('not.be.disabled');
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
  });
});
