// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { Scenarios, ScenarioManager, ScenarioParameters, ScenarioSelector } from '../../commons/actions';
import { BreweryParameters, Login } from '../../commons/actions/brewery';
import {
  BAR_PARAMETERS_RANGE,
  BASIC_PARAMETERS_CONST,
  DATASET,
  RUN_TEMPLATE,
} from '../../commons/constants/brewery/TestConstants';
import {
  URL_REGEX,
  PAGE_NAME,
  URL_ROOT,
  SCENARIO_RUN_IN_PROGRESS,
} from '../../commons/constants/generic/TestConstants';

describe('Create scenario', () => {
  const randomString = utils.randomStr(5);
  const scenarioMasterName = 'Test Cypress - Scenario creation - Master - ' + randomString;
  const scenarioChildName = 'Test Cypress - Scenario creation - Child - ' + randomString;
  const scenarioWithBasicTypesName = 'Test Cypress - Scenario creation - Basic types - ' + randomString;
  const otherScenarioName = 'Test Cypress - Scenario creation - Another scenario - ' + randomString;
  let scenarioMasterId, scenarioChildId, scenarioWithBasicTypesId, otherScenarioId, anotherScenarioUrlRegex;

  const stock = utils.randomNmbr(BAR_PARAMETERS_RANGE.STOCK.MIN, BAR_PARAMETERS_RANGE.STOCK.MAX);
  const restock = utils.randomNmbr(BAR_PARAMETERS_RANGE.RESTOCK.MIN, BAR_PARAMETERS_RANGE.RESTOCK.MAX);
  const waiters = utils.randomNmbr(BAR_PARAMETERS_RANGE.WAITERS.MIN, BAR_PARAMETERS_RANGE.WAITERS.MAX);
  const textValue = utils.randomStr(8);
  const numberValue = utils.randomNmbr(BASIC_PARAMETERS_CONST.NUMBER.MIN, BASIC_PARAMETERS_CONST.NUMBER.MAX);
  const startDateValue = utils.randomDate(BASIC_PARAMETERS_CONST.DATE.MIN, BASIC_PARAMETERS_CONST.DATE.MIDDLE);
  const endDateValue = utils.randomDate(BASIC_PARAMETERS_CONST.DATE.MIDDLE, BASIC_PARAMETERS_CONST.DATE.MAX);
  const sliderValue = utils.randomNmbr(BASIC_PARAMETERS_CONST.SLIDER.MIN, BASIC_PARAMETERS_CONST.SLIDER.MAX);

  Cypress.Keyboard.defaults({
    keystrokeDelay: 0,
  });

  before(() => {
    Login.login();
    // Create "another scenarios"
    Scenarios.createScenario(otherScenarioName, true, DATASET.BREWERY_ADT, RUN_TEMPLATE.BREWERY_PARAMETERS).then(
      (value) => {
        otherScenarioId = value.scenarioCreatedId;
        anotherScenarioUrlRegex = new RegExp(`^${URL_ROOT}/.*${PAGE_NAME.SCENARIOS}/${otherScenarioId}`);
      }
    );
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    const scenarioNamesToDelete = [
      scenarioMasterName,
      scenarioChildName,
      otherScenarioName,
      scenarioWithBasicTypesName,
    ];
    ScenarioManager.deleteScenarioList(scenarioNamesToDelete);
  });

  it('run templates are correctly filtered', () => {
    Scenarios.openScenarioCreationDialog();
    Scenarios.getScenarioCreationDialogRunTypeSelector().click();

    const visibleRunTemplates = [
      RUN_TEMPLATE.BREWERY_PARAMETERS,
      RUN_TEMPLATE.BASIC_TYPES,
      RUN_TEMPLATE.WITHOUT_PARAMETERS,
    ];
    for (const runTemplate of visibleRunTemplates) {
      Scenarios.getScenarioCreationDialogRunTypeSelectorOptions().contains(runTemplate).should('be.visible');
    }

    Scenarios.getScenarioCreationDialogRunTypeSelectorOptions().contains(RUN_TEMPLATE.HIDDEN).should('not.exist');
  });

  it('can create and launch scenario master', () => {
    // Check parameters accordion
    ScenarioParameters.getParametersTabs(20).should('not.be.visible');
    ScenarioParameters.expandParametersAccordion();
    ScenarioParameters.getParametersTabs().should('be.visible');
    ScenarioParameters.collapseParametersAccordion();
    ScenarioParameters.getParametersTabs().should('not.be.visible');

    // Check persistance of parameters accordion state
    ScenarioManager.switchToScenarioManager();
    Scenarios.switchToScenarioView();
    ScenarioParameters.getParametersTabs().should('not.be.visible');
    ScenarioParameters.expandParametersAccordion();
    ScenarioParameters.getParametersTabs().should('be.visible');
    ScenarioManager.switchToScenarioManager();
    Scenarios.switchToScenarioView();
    ScenarioParameters.getParametersTabs().should('be.visible');
    cy.reload();
    ScenarioParameters.getParametersTabs(20).should('be.visible');
    ScenarioParameters.collapseParametersAccordion();
    ScenarioParameters.getParametersTabs().should('not.be.visible');
    ScenarioManager.switchToScenarioManager();
    Scenarios.switchToScenarioView();
    ScenarioParameters.getParametersTabs().should('not.be.visible');
    cy.reload();
    ScenarioParameters.getParametersTabs(20).should('not.be.visible');

    // Create scenario master:
    let scenarioName, scenarioRunTemplateName;
    Scenarios.createScenario(scenarioMasterName, true, DATASET.BREWERY_ADT, RUN_TEMPLATE.BREWERY_PARAMETERS).then(
      (value) => {
        scenarioMasterId = value.scenarioCreatedId;
        scenarioName = value.scenarioCreatedName;
        scenarioRunTemplateName = value.scenarioCreatedRunTemplateName;

        Scenarios.getScenarioRunTemplate().contains(scenarioRunTemplateName, { matchCase: false });

        // Check parameters accordion state after creating scenario
        ScenarioParameters.getParametersTabs().should('be.visible');
        ScenarioManager.switchToScenarioManager();
        Scenarios.switchToScenarioView();
        ScenarioParameters.getParametersTabs().should('be.visible');
        ScenarioParameters.collapseParametersAccordion();
        ScenarioParameters.getParametersTabs().should('not.be.visible');

        // Edit master parameters values
        ScenarioParameters.expandParametersAccordion();
        ScenarioParameters.getParametersTabs().should('be.visible');
        BreweryParameters.getStockInput().clear().type(stock);
        BreweryParameters.getRestockInput().clear().type(restock);
        BreweryParameters.getWaitersInput().clear().type(waiters);

        // Update and launch scenario master
        cy.intercept('PATCH', URL_REGEX.SCENARIO_PAGE_WITH_ID).as('requestEditScenario');
        cy.intercept('POST', URL_REGEX.SCENARIO_PAGE_RUN_WITH_ID).as('requestRunScenario');

        ScenarioParameters.launch();

        cy.wait('@requestEditScenario').should((value) => {
          const { name: nameGet, id: idGet, parametersValues: paramsGet, state } = value.response.body;
          const stockGet = parseFloat(paramsGet.find((obj) => obj.parameterId === 'stock').value);
          const restockGet = parseFloat(paramsGet.find((obj) => obj.parameterId === 'restock_qty').value);
          const waitersGet = parseFloat(paramsGet.find((obj) => obj.parameterId === 'nb_waiters').value);
          expect(nameGet).equal(scenarioName);
          expect(state).equal('Created');
          expect(idGet).equal(scenarioMasterId);
          expect(stockGet).equal(stock);
          expect(restockGet).equal(restock);
          expect(waitersGet).equal(waiters);
        });

        cy.wait('@requestRunScenario').should((value) => {
          expect(value.response.body.scenarioId).equal(scenarioMasterId);
        });

        Scenarios.getDashboardPlaceholder().should('have.text', SCENARIO_RUN_IN_PROGRESS);

        // Switch to another scenario then come back to the first scenario
        cy.intercept('GET', anotherScenarioUrlRegex).as('requestUpdateCurrentScenario2');
        ScenarioSelector.selectScenario(otherScenarioName, otherScenarioId);

        cy.wait('@requestUpdateCurrentScenario2')
          .its('response')
          .its('body')
          .its('name')
          .should('equal', otherScenarioName);

        ScenarioSelector.getScenarioSelectorInput().should('value', otherScenarioName);

        ScenarioSelector.selectScenario(scenarioMasterName, scenarioMasterId);
        ScenarioSelector.getScenarioSelectorInput().should('value', scenarioMasterName);

        // Check parameters values in read only mode
        BreweryParameters.getStock().should('have.text', stock.toString());
        BreweryParameters.getRestock().should('have.text', restock.toString());
        BreweryParameters.getWaiters().should('have.text', waiters.toString());
      }
    );
  });

  it('can create scenario child', () => {
    // Create Scenario Child
    let scenarioCreatedName;
    Scenarios.createScenario(scenarioChildName, false, scenarioMasterName, RUN_TEMPLATE.BREWERY_PARAMETERS).then(
      (value) => {
        scenarioChildId = value.scenarioCreatedId;
        scenarioCreatedName = value.scenarioCreatedName;

        // Check inherited children parameters
        Scenarios.getScenarioLoadingSpinner(15).should('exist').should('not.be.visible');
        BreweryParameters.getStockInput().should('value', stock.toString());
        BreweryParameters.getRestockInput().should('value', restock.toString());
        BreweryParameters.getWaitersInput().should('value', waiters.toString());

        // Edit child parameters values
        const childStock = utils.randomNmbr(BAR_PARAMETERS_RANGE.STOCK.MIN, BAR_PARAMETERS_RANGE.STOCK.MAX);
        const childRestock = utils.randomNmbr(BAR_PARAMETERS_RANGE.RESTOCK.MIN, BAR_PARAMETERS_RANGE.RESTOCK.MAX);
        const childWaiters = utils.randomNmbr(BAR_PARAMETERS_RANGE.WAITERS.MIN, BAR_PARAMETERS_RANGE.WAITERS.MAX);

        ScenarioParameters.getParametersTabs().should('be.visible');
        BreweryParameters.getStockInput().clear().type(childStock);
        BreweryParameters.getRestockInput().clear().type(childRestock);
        BreweryParameters.getWaitersInput().clear().type(childWaiters);

        // save scenario child
        const reqUpdateScenarioAlias = ScenarioParameters.save({ wait: false });
        // "saving" backdrop must be visible during save
        Scenarios.getScenarioBackdrop().should('exist').should('be.visible');
        Scenarios.getScenarioBackdropSavingText().should('be.visible');
        Scenarios.getScenarioLoadingSpinner().should('be.visible');
        // The backdrop should have disappeared, after 10 seconds
        Scenarios.getScenarioBackdrop(10).should('not.be.visible');
        Scenarios.getScenarioBackdropSavingText().should('not.exist');
        Scenarios.getScenarioLoadingSpinner().should('not.be.visible');

        cy.wait('@' + reqUpdateScenarioAlias).should((value) => {
          const { name: nameGet, id: idGet, parametersValues: paramsGet } = value.response.body;
          const stockGet = parseFloat(paramsGet.find((obj) => obj.parameterId === 'stock').value);
          const restockGet = parseFloat(paramsGet.find((obj) => obj.parameterId === 'restock_qty').value);
          const waitersGet = parseFloat(paramsGet.find((obj) => obj.parameterId === 'nb_waiters').value);
          expect(nameGet).equal(scenarioCreatedName);
          expect(idGet).equal(scenarioChildId);
          expect(stockGet).equal(childStock);
          expect(restockGet).equal(childRestock);
          expect(waitersGet).equal(childWaiters);
        });

        // Switch to another scenario then come back to the first scenario
        cy.intercept('GET', anotherScenarioUrlRegex).as('requestUpdateCurrentScenario2');

        ScenarioSelector.selectScenario(otherScenarioName, otherScenarioId);

        cy.wait('@requestUpdateCurrentScenario2').should((value) => {
          const nameGet = value.response.body.name;
          expect(nameGet).equal(otherScenarioName);
        });

        ScenarioSelector.getScenarioSelectorInput().should('value', otherScenarioName);
        ScenarioSelector.selectScenario(scenarioChildName, scenarioChildId);
        ScenarioSelector.getScenarioSelectorInput().should('value', scenarioChildName);

        BreweryParameters.getStockInput().should('value', childStock);
        BreweryParameters.getRestockInput().should('value', childRestock);
        BreweryParameters.getWaitersInput().should('value', childWaiters);
      }
    );
  });

  it('can create scenario, edit/discard parameters and switch between parameters tabs', () => {
    // Create Scenario with some parameters tabs
    let scenarioCreatedName;
    Scenarios.createScenario(scenarioWithBasicTypesName, true, DATASET.BREWERY_ADT, RUN_TEMPLATE.BASIC_TYPES).then(
      (value) => {
        scenarioWithBasicTypesId = value.scenarioCreatedId;
        scenarioCreatedName = value.scenarioCreatedName;
      }
    );

    // Edit parameters values
    BreweryParameters.switchToBasicTypesTab();

    ScenarioParameters.getInputValue(BreweryParameters.getCurrencyNameInput()).as('currency-name');
    ScenarioParameters.getInputValue(BreweryParameters.getCurrencyValueInput()).as('currency-value');
    ScenarioParameters.getInputValue(BreweryParameters.getCurrencyUsedInput()).as('currency-used');
    ScenarioParameters.getInputValue(BreweryParameters.getStartDateInput()).as('start-date');
    ScenarioParameters.getInputValue(BreweryParameters.getEndDateInput()).as('end-date');
    ScenarioParameters.getInputValue(BreweryParameters.getAverageConsumptionInput()).as('average-consumption');

    BreweryParameters.getCurrencyNameInput().click().clear().type(textValue);
    BreweryParameters.getCurrencyValueInput().click().clear().type(numberValue);
    BreweryParameters.getCurrencySelectOption(BASIC_PARAMETERS_CONST.ENUM_KEYS.JPY);
    BreweryParameters.getCurrencyUsedInput().check();
    BreweryParameters.getStartDateInput()
      .click()
      .type('{moveToStart}' + startDateValue);
    BreweryParameters.getEndDateInput()
      .click()
      .type('{moveToStart}' + endDateValue);
    BreweryParameters.moveAverageConsumptionSlider(sliderValue);

    // Switch parameters tabs then back and check parameters,
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.switchToBasicTypesTab();

    BreweryParameters.getCurrencyNameInput().should('value', textValue);
    BreweryParameters.getCurrencyValueInput().should('value', numberValue);
    BreweryParameters.getCurrencyInput().should('value', BASIC_PARAMETERS_CONST.ENUM_KEYS.JPY);
    BreweryParameters.getCurrencyParameterContainer().contains(BASIC_PARAMETERS_CONST.ENUM.JPY);
    BreweryParameters.getCurrencyUsedInput().should('be.checked');
    BreweryParameters.getStartDateInput().should('value', startDateValue);
    BreweryParameters.getEndDateInput().should('value', endDateValue);
    BreweryParameters.getAverageConsumptionInput().should('value', sliderValue);

    // Discard
    ScenarioParameters.discard();

    cy.get('@currency-name').then((input) => {
      BreweryParameters.getCurrencyNameInput().should('value', input);
    });
    cy.get('@currency-value').then((input) => {
      BreweryParameters.getCurrencyValueInput().should('value', input);
    });

    BreweryParameters.getCurrencyParameterContainer().contains(BASIC_PARAMETERS_CONST.ENUM.USD);

    cy.get('@currency-used').then(() => {
      BreweryParameters.getCurrencyUsedInput().should('not.be.checked');
    });
    cy.get('@start-date').then((input) => {
      BreweryParameters.getStartDateInput().should('value', input);
    });
    cy.get('@end-date').then((input) => {
      BreweryParameters.getEndDateInput().should('value', input);
    });
    cy.get('@average-consumption').then((input) => {
      BreweryParameters.getAverageConsumptionInput().should('value', input);
    });

    // re-edit
    BreweryParameters.switchToBasicTypesTab();

    BreweryParameters.getCurrencyNameInput().click().clear().type(textValue);
    BreweryParameters.getCurrencyValueInput().click().clear().type(numberValue);
    BreweryParameters.getCurrencySelectOption(BASIC_PARAMETERS_CONST.ENUM_KEYS.JPY);
    BreweryParameters.getCurrencyUsedInput().check();
    BreweryParameters.getStartDateInput()
      .click()
      .type('{moveToStart}' + startDateValue);
    BreweryParameters.getEndDateInput()
      .click()
      .type('{moveToStart}' + endDateValue);
    BreweryParameters.moveAverageConsumptionSlider(sliderValue);
    // update and launch
    cy.intercept('PATCH', URL_REGEX.SCENARIO_PAGE_WITH_ID).as('requestEditScenario');
    cy.intercept('POST', URL_REGEX.SCENARIO_PAGE_RUN_WITH_ID).as('requestRunScenario');

    ScenarioParameters.launch();

    cy.wait('@requestEditScenario').should((value) => {
      const { name: nameGet, id: idGet, parametersValues: paramsGet, state } = value.response.body;
      const textGet = paramsGet.find((obj) => obj.parameterId === 'currency_name').value;
      const numberGet = parseFloat(paramsGet.find((obj) => obj.parameterId === 'currency_value').value);
      const enumGet = paramsGet.find((obj) => obj.parameterId === 'currency').value;
      const boolGet = paramsGet.find((obj) => obj.parameterId === 'currency_used').value;
      const startDateGet = utils.stringToDateInputExpectedFormat(
        new Date(paramsGet.find((obj) => obj.parameterId === 'start_date').value)
      );
      const endDateGet = utils.stringToDateInputExpectedFormat(
        new Date(paramsGet.find((obj) => obj.parameterId === 'end_date').value)
      );
      const sliderNumberGet = paramsGet.find((obj) => obj.parameterId === 'average_consumption').value;
      expect(state).equal('Created');
      expect(nameGet).equal(scenarioCreatedName);
      expect(idGet).equal(scenarioWithBasicTypesId);
      expect(textGet).equal(textValue);
      expect(numberGet).equal(numberValue);
      expect(enumGet).equal(BASIC_PARAMETERS_CONST.ENUM_KEYS.JPY);
      expect(boolGet).equal('true');
      expect(startDateGet).equal(startDateValue);
      expect(endDateGet).equal(endDateValue);
      expect(sliderNumberGet).equal(sliderValue.toString());
    });

    cy.wait('@requestRunScenario').should((value) => {
      expect(value.response.body.scenarioId).equal(scenarioWithBasicTypesId);
    });

    // Check parameters values in read only mode
    ScenarioParameters.expandParametersAccordion();

    BreweryParameters.getCurrencyName().should('have.text', textValue);
    BreweryParameters.getCurrencyValue().should('have.text', numberValue);

    BreweryParameters.getCurrency().should('have.text', BASIC_PARAMETERS_CONST.ENUM.JPY);
    BreweryParameters.getCurrencyUsed().should('have.text', 'ON');
    BreweryParameters.getStartDate().should('have.text', new Date(startDateValue).toLocaleDateString());
    BreweryParameters.getEndDate().should('have.text', new Date(endDateValue).toLocaleDateString());
    BreweryParameters.getAverageConsumption().should('have.text', sliderValue);

    Scenarios.getDashboardPlaceholder().should('have.text', SCENARIO_RUN_IN_PROGRESS);
  });
});
