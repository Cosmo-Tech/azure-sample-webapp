// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import 'cypress-file-upload';
import utils from '../../commons/TestUtils';

import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { Downloads, Login, Scenarios, ScenarioManager, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});

const SCENARIO_DATASET = DATASET.BREWERY_ADT;
const SCENARIO_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;
const VALID_FILE_PATH_EMPTY = 'customers_empty.csv';
// const VALID_FILE_PATH_WITH_SPACES = 'customers_with_spaces.csv';
// const VALID_FILE_PATH = 'customers.csv';
// const INVALID_FILE_PATH = 'customers_invalid.csv';
const COL_NAMES = ['name', 'age', 'canDrinkAlcohol', 'favoriteDrink', 'birthday', 'height'];

function forgeScenarioName() {
  const prefix = 'Scenario with table - ';
  return `${prefix}${utils.randomStr(7)}`;
}

describe('Table parameters standard operations', () => {
  before(() => {
    Login.login();
  });

  beforeEach(() => {
    Login.relogin();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    Downloads.clearDownloadsFolder();
    // Delete all tests scenarios
    ScenarioManager.switchToScenarioManager();
    for (const scenarioName of scenarioNamesToDelete) {
      ScenarioManager.deleteScenario(scenarioName);
    }
  });

  it('can open the customers scenario parameters tab, and export an empty file', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTable().should('be.visible');
    BreweryParameters.getCustomersTableLabel().should('be.visible').should('have.text', 'Customers');
    BreweryParameters.getCustomersTableGrid().should('be.visible');
    BreweryParameters.getCustomersImportButton().should('be.visible');
    BreweryParameters.getCustomersExportButton().should('be.visible');
    BreweryParameters.getCustomersTableHeader().should('not.exist');
    BreweryParameters.exportCustomersTableDataToCSV();
    Downloads.checkByContent('customers.csv', COL_NAMES.join());
  });

  it('can import an empty CSV file and export the table afterwards', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableHeader().should('not.exist');
    ScenarioParameters.edit();
    BreweryParameters.importCustomersTableDataFromCSV(VALID_FILE_PATH_EMPTY);
    BreweryParameters.getCustomersTableHeader().should('be.visible');
    COL_NAMES.forEach((col) => {
      BreweryParameters.getCustomersTableHeaderCell(col).should('be.visible');
    });
    BreweryParameters.exportCustomersTableDataToCSV();
    Downloads.checkByContent('customers.csv', COL_NAMES.join());
  });
});

describe('Table parameters errors handling', () => {
  before(() => {
    Login.login();
  });

  beforeEach(() => {
    Login.relogin();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    Downloads.clearDownloadsFolder();
    // Delete all tests scenarios
    ScenarioManager.switchToScenarioManager();
    for (const scenarioName of scenarioNamesToDelete) {
      ScenarioManager.deleteScenario(scenarioName);
    }
  });

  it('can import an invalid CSV file and display the errors panel', () => {
    // TBD
  });
});
