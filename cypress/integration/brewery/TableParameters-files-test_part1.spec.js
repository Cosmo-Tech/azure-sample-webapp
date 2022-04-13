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
const CSV_VALID_FILE_PATH_EMPTY = 'customers_empty.csv';
const CSV_VALID_FILE_PATH_WITH_SPACES = 'customers_with_spaces.csv';
const XLSX_VALID_FILE_PATH_EMPTY = 'customers_empty.xlsx';

const COL_NAMES = ['name', 'age', 'canDrinkAlcohol', 'favoriteDrink', 'birthday', 'height'];

function forgeScenarioName() {
  const prefix = 'Scenario with table - ';
  return `${prefix}${utils.randomStr(7)}`;
}

describe('Table parameters files standard operations part 1', () => {
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

  it('can open the customers scenario parameters tab, and export an empty grid', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTable().should('be.visible');
    BreweryParameters.getCustomersTableLabel().should('be.visible').should('have.text', 'Customers');
    BreweryParameters.getCustomersTableGrid().should('be.visible');
    BreweryParameters.getCustomersImportButton().should('be.visible');
    BreweryParameters.getCustomersCSVExportButton().should('be.visible');
    BreweryParameters.getCustomersTableHeader().should('not.exist');
    BreweryParameters.exportCustomersTableDataToCSV();
    Downloads.checkByContent('customers.csv', COL_NAMES.join());
  });

  it('can import empty CSV & XLSX files and export the table afterwards', () => {
    const checkAndExport = () => {
      ScenarioParameters.expandParametersAccordion();
      BreweryParameters.getCustomersErrorsPanel().should('not.exist');
      BreweryParameters.getCustomersTableHeader().should('be.visible');
      COL_NAMES.forEach((col) => {
        BreweryParameters.getCustomersTableHeaderCell(col).should('be.visible');
      });
      BreweryParameters.exportCustomersTableDataToCSV();
      Downloads.checkByContent('customers.csv', COL_NAMES.join());
    };

    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    ScenarioParameters.edit();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableHeader().should('not.exist');
    BreweryParameters.importCustomersTableData(CSV_VALID_FILE_PATH_EMPTY);
    checkAndExport();
    BreweryParameters.importCustomersTableData(XLSX_VALID_FILE_PATH_EMPTY);
    checkAndExport();
  });

  it('can import a CSV file with spaces and boolean values to re-format', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    ScenarioParameters.edit();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.importCustomersTableData(CSV_VALID_FILE_PATH_WITH_SPACES);
    BreweryParameters.getCustomersTableRows().should('have.length', 4);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Bob');
    BreweryParameters.getCustomersTableCell('name', 1).should('have.text', 'Lily');
    BreweryParameters.getCustomersTableCell('name', 2).should('have.text', 'Maria');
    BreweryParameters.getCustomersTableCell('name', 3).should('have.text', 'Howard');
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '10');
    BreweryParameters.getCustomersTableCell('age', 1).should('have.text', '8');
    BreweryParameters.getCustomersTableCell('age', 2).should('have.text', '34');
    BreweryParameters.getCustomersTableCell('age', 3).should('have.text', '34');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 0).should('have.text', 'false');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 1).should('have.text', 'false');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 2).should('have.text', 'true');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 3).should('have.text', 'true');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 0).should('have.text', 'AppleJuice');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 1).should('have.text', 'AppleJuice');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 2).should('have.text', 'Wine');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 3).should('have.text', 'Beer');
    BreweryParameters.getCustomersTableCell('birthday', 0).should('have.text', '01/04/2011');
    BreweryParameters.getCustomersTableCell('birthday', 1).should('have.text', '09/05/2013');
    BreweryParameters.getCustomersTableCell('birthday', 2).should('have.text', '19/03/1987');
    BreweryParameters.getCustomersTableCell('birthday', 3).should('have.text', '12/05/1987');
    BreweryParameters.getCustomersTableCell('height', 0).should('have.text', '1.40');
    BreweryParameters.getCustomersTableCell('height', 1).should('have.text', '1.41');
    BreweryParameters.getCustomersTableCell('height', 2).should('have.text', '1.90');
    BreweryParameters.getCustomersTableCell('height', 3).should('have.text', '1.83');
  });
});
