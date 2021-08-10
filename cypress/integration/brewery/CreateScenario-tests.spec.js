// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  SCENARIO_NAME,
  SCENARIO_ID,
  BAR_PARAMETERS_RANGE,
  PAGE_NAME,
  URL_ROOT,
  DATASET,
  SCENARIO_TYPE,
  SCENARIO_RUN_IN_PROGRESS
} from '../../constants/TestConstants.js';
import { SELECTORS } from '../../constants/IdConstants';

const randomStr = (figureNbr) => {
  return Math.random().toString(36).substring(figureNbr);
};

const randomNmbr = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min) + min);
};

describe('Create scenario', () => {
  const scenarioMasterName = SCENARIO_NAME.SCENARIO_MASTER + randomStr(7);
  const scenarioChildName = SCENARIO_NAME.SCENARIO_CHILD + randomStr(7);
  const otherScenarioName = SCENARIO_NAME.OTHER_SCENARIO;

  const stock = randomNmbr(BAR_PARAMETERS_RANGE.STOCK.MIN, BAR_PARAMETERS_RANGE.STOCK.MAX);
  const restock = randomNmbr(BAR_PARAMETERS_RANGE.RESTOCK.MIN, BAR_PARAMETERS_RANGE.RESTOCK.MAX);
  const waiters = randomNmbr(BAR_PARAMETERS_RANGE.WAITERS.MIN, BAR_PARAMETERS_RANGE.WAITERS.MAX);

  const urlRegexWithoutSuffix = new RegExp(`^${URL_ROOT}/.*${PAGE_NAME.SCENARIOS}`);
  const urlRegexWithUnknownIdScenarioSuffix = new RegExp(`^${URL_ROOT}/.*${PAGE_NAME.SCENARIOS}/S-.*`);
  const urlRegexWithOtherScenarioId =
    new RegExp(`^${URL_ROOT}/.*${PAGE_NAME.SCENARIOS}/${SCENARIO_ID.OTHER_SCENARIO}`);
  const urlRegexWithRunSuffix = new RegExp(`^${URL_ROOT}/.*${PAGE_NAME.SCENARIOS}/S-.*/run`);

  Cypress.Keyboard.defaults({
    keystrokeDelay: 0
  });

  it('can create and lauch scenario master', () => {
    // Log and launch app on scenario view
    cy.visit(PAGE_NAME.SCENARIO);
    cy.login();

    // Create scenario master
    cy.get(SELECTORS.scenario.createButton).click();
    cy.get(SELECTORS.scenario.createDialog.dialog).should('be.visible');

    cy.get(SELECTORS.scenario.createDialog.masterCheckbox).click();
    cy.get(SELECTORS.scenario.createDialog.nameTextfield).type(scenarioMasterName);
    cy.get(SELECTORS.scenario.createDialog.datasetSelect).click().clear()
      .type(DATASET.BREWERY_ADT + '{downarrow}{enter}');
    cy.get(SELECTORS.scenario.createDialog.typeSelect).click().clear()
      .type(SCENARIO_TYPE.BREWERY_PARAMETERS + '{enter}');

    cy.intercept('POST', urlRegexWithoutSuffix)
      .as('requestCreateScenario');
    cy.intercept('GET', urlRegexWithoutSuffix)
      .as('requestUpdateScenarioList2');

    cy.get(SELECTORS.scenario.createDialog.submitButton).click();

    let scenarioCreatedId, scenarioCreatedName;
    cy.wait('@requestCreateScenario').should((req) => {
      scenarioCreatedName = req.response.body.name;
      scenarioCreatedId = req.response.body.id;
      cy.wrap(scenarioCreatedId).as('scenarioCreatedId');
      expect(scenarioCreatedName).equal(scenarioMasterName);
    });

    cy.wait('@requestUpdateScenarioList2').should((req) => {
      const nameGet = req.response.body.find(obj => obj.id === scenarioCreatedId).name;
      expect(nameGet).equal(scenarioCreatedName);
      expect(nameGet).equal(scenarioMasterName);
    });

    cy.get(SELECTORS.scenario.selectInput).find('input').should('have.value', scenarioMasterName);

    // Edit master paramameters values
    cy.get(SELECTORS.scenario.parameters.editButton).click();
    cy.get(SELECTORS.scenario.parameters.tabs).should('be.visible');
    cy.get(SELECTORS.scenario.parameters.stockInput).find('input').clear().type(stock);
    cy.get(SELECTORS.scenario.parameters.restockInput).find('input').clear().type(restock);
    cy.get(SELECTORS.scenario.parameters.waitersInput).find('input').clear().type(waiters);

    // Launch scenario master
    cy.intercept('PATCH', urlRegexWithUnknownIdScenarioSuffix)
      .as('requestEditScenario');
    cy.intercept('POST', urlRegexWithRunSuffix)
      .as('requestRunScenario');

    cy.get('[data-cy=update-and-launch-scenario]').click();

    cy.wait('@requestEditScenario').should((req) => {
      const { name: nameGet, id: idGet, parametersValues: paramsGet, state } = req.response.body;
      const stockGet = parseFloat(paramsGet.find(obj => obj.parameterId === 'stock').value);
      const restockGet = parseFloat(paramsGet.find(obj => obj.parameterId === 'restock_qty').value);
      const waitersGet = parseFloat(paramsGet.find(obj => obj.parameterId === 'nb_waiters').value);
      expect(nameGet).equal(scenarioCreatedName);
      expect(state).equal('Created');
      expect(idGet).equal(scenarioCreatedId);
      expect(stockGet).equal(stock);
      expect(restockGet).equal(restock);
      expect(waitersGet).equal(waiters);
    });

    cy.wait('@requestRunScenario').should((req) => {
      expect(req.response.body.scenarioId).equal(scenarioCreatedId);
    });

    cy.get(SELECTORS.scenario.dashboard.placeholder).should('have.text', SCENARIO_RUN_IN_PROGRESS);

    // Switch to another scenario then come back to the first scenario
    cy.intercept('GET', urlRegexWithOtherScenarioId)
      .as('requestUpdateCurrentScenario2');
    cy.log('url: ' + urlRegexWithOtherScenarioId);

    cy.get(SELECTORS.scenario.selectInput).click().clear().type(otherScenarioName + '{downarrow}{enter}');

    cy.wait('@requestUpdateCurrentScenario2').its('response').its('body')
      .its('name').should('equal', otherScenarioName);

    cy.get(SELECTORS.scenario.selectInput).find('input').should('have.value', otherScenarioName);

    let urlRegexWithICreatedScenarioIdSuffix;
    cy.get('@scenarioCreatedId').then(scenarioCreatedId => {
      urlRegexWithICreatedScenarioIdSuffix = new RegExp(`^${URL_ROOT}/.*${PAGE_NAME.SCENARIOS}/${scenarioCreatedId}`);
      cy.intercept('GET', urlRegexWithICreatedScenarioIdSuffix).as('requestUpdateCurrentScenario3');
    });

    cy.get(SELECTORS.scenario.selectInput).clear().type(scenarioMasterName + '{downarrow}{enter}');

    cy.wait('@requestUpdateCurrentScenario3').its('response').its('body')
      .its('name').should('equal', scenarioMasterName);

    cy.get(SELECTORS.scenario.selectInput).find('input').should('have.value', scenarioMasterName);

    cy.get(SELECTORS.scenario.parameters.stockInput).find('input').should('have.value', stock);
    cy.get(SELECTORS.scenario.parameters.restockInput).find('input').should('have.value', restock);
    cy.get(SELECTORS.scenario.parameters.waitersInput).find('input').should('have.value', waiters);
  });

  it('can create scenario child', () => {
    // Log and launch app on scenario view
    cy.visit(PAGE_NAME.SCENARIO);
    cy.login();

    // Create Scenario Child
    cy.visit(PAGE_NAME.SCENARIO);

    cy.get(SELECTORS.scenario.createButton).click();
    cy.get(SELECTORS.scenario.createDialog.dialog).should('be.visible');

    cy.get(SELECTORS.scenario.createDialog.nameTextfield).type(scenarioChildName);

    cy.get(SELECTORS.scenario.createDialog.dialog).click().find(SELECTORS.scenario.selectInput).clear()
      .type(scenarioMasterName + '{downarrow}{enter}');

    cy.get(SELECTORS.scenario.createDialog.typeSelect).clear().type(SCENARIO_TYPE.BREWERY_PARAMETERS + '{enter}');

    cy.intercept('POST', urlRegexWithoutSuffix)
      .as('requestCreateScenario');
    cy.intercept('GET', urlRegexWithoutSuffix)
      .as('requestUpdateScenarioList');

    cy.get(SELECTORS.scenario.createDialog.submitButton).click();

    let scenarioCreatedId, scenarioCreatedName;
    cy.wait('@requestCreateScenario').should((req) => {
      scenarioCreatedName = req.response.body.name;
      scenarioCreatedId = req.response.body.id;
      cy.wrap(scenarioCreatedId).as('scenarioCreatedId');
      expect(scenarioCreatedName).equal(scenarioChildName);
    });

    cy.wait('@requestUpdateScenarioList').should((req) => {
      const scenarioListGet = req.response.body;
      const scenarioNameGet = scenarioListGet.find(obj => obj.id === scenarioCreatedId).name;
      expect(scenarioNameGet).equal(scenarioCreatedName);
      expect(scenarioNameGet).equal(scenarioChildName);
    });

    cy.get(SELECTORS.scenario.selectInput).find('input').should('have.value', scenarioChildName);

    cy.get(SELECTORS.scenario.parameters.stockInput).find('input').should('have.value', stock);
    cy.get(SELECTORS.scenario.parameters.restockInput).find('input').should('have.value', restock);
    cy.get(SELECTORS.scenario.parameters.waitersInput).find('input').should('have.value', waiters);

    // Edit child paramameters values
    const childStock = randomNmbr(BAR_PARAMETERS_RANGE.STOCK.MIN, BAR_PARAMETERS_RANGE.STOCK.MAX);
    const childRestock = randomNmbr(BAR_PARAMETERS_RANGE.RESTOCK.MIN, BAR_PARAMETERS_RANGE.RESTOCK.MAX);
    const childWaiters = randomNmbr(BAR_PARAMETERS_RANGE.WAITERS.MIN, BAR_PARAMETERS_RANGE.WAITERS.MAX);

    cy.get(SELECTORS.scenario.parameters.editButton).click();
    cy.get(SELECTORS.scenario.parameters.tabs).should('be.visible');
    cy.get(SELECTORS.scenario.parameters.stockInput).find('input').clear().type(childStock);
    cy.get(SELECTORS.scenario.parameters.restockInput).find('input').clear().type(childRestock);
    cy.get(SELECTORS.scenario.parameters.waitersInput).find('input').clear().type(childWaiters);

    // Launch scenario child
    cy.intercept('PATCH', urlRegexWithUnknownIdScenarioSuffix)
      .as('requestEditScenario');
    cy.intercept('POST', urlRegexWithRunSuffix)
      .as('requestRunScenario');

    cy.get(SELECTORS.scenario.parameters.updateAndLaunchButton).click();

    cy.wait('@requestEditScenario').should((req) => {
      const { name: nameGet, id: idGet, parametersValues: paramsGet } = req.response.body;
      const stockGet = parseFloat(paramsGet.find(obj => obj.parameterId === 'stock').value);
      const restockGet = parseFloat(paramsGet.find(obj => obj.parameterId === 'restock_qty').value);
      const waitersGet = parseFloat(paramsGet.find(obj => obj.parameterId === 'nb_waiters').value);
      expect(nameGet).equal(scenarioCreatedName);
      expect(idGet).equal(scenarioCreatedId);
      expect(stockGet).equal(childStock);
      expect(restockGet).equal(childRestock);
      expect(waitersGet).equal(childWaiters);
    });

    cy.wait('@requestRunScenario').should((req) => {
      expect(req.response.body.scenarioId).equal(scenarioCreatedId);
    });

    cy.get(SELECTORS.scenario.dashboard.placeholder).should('have.text', SCENARIO_RUN_IN_PROGRESS);

    // Switch to another scenario then come back to the first scenario
    cy.intercept('GET', urlRegexWithOtherScenarioId)
      .as('requestUpdateCurrentScenario2');

    cy.get(SELECTORS.scenario.selectInput).click().clear().type(otherScenarioName + '{downarrow}{enter}');

    cy.wait('@requestUpdateCurrentScenario2').should((req) => {
      const nameGet = req.response.body.name;
      expect(nameGet).equal(otherScenarioName);
    });

    cy.get(SELECTORS.scenario.selectInput).find('input').should('have.value', otherScenarioName);

    let urlRegexWithICreatedScenarioIdSuffix;
    cy.get('@scenarioCreatedId').then(scenarioCreatedId => {
      urlRegexWithICreatedScenarioIdSuffix = new RegExp(`^${URL_ROOT}/.*${PAGE_NAME.SCENARIOS}/${scenarioCreatedId}`);
      cy.intercept('GET', urlRegexWithICreatedScenarioIdSuffix).as('requestUpdateCurrentScenario3');
    });

    cy.get(SELECTORS.scenario.selectInput).clear().type(scenarioChildName + '{downarrow}{enter}');

    cy.wait('@requestUpdateCurrentScenario3').should((req) => {
      const nameGet = req.response.body.name;
      expect(nameGet).equal(scenarioChildName);
    });

    cy.get(SELECTORS.scenario.selectInput).find('input').should('have.value', scenarioChildName);

    cy.get(SELECTORS.scenario.parameters.stockInput).find('input').should('have.value', childStock);
    cy.get(SELECTORS.scenario.parameters.restockInput).find('input').should('have.value', childRestock);
    cy.get(SELECTORS.scenario.parameters.waitersInput).find('input').should('have.value', childWaiters);
  });
});
