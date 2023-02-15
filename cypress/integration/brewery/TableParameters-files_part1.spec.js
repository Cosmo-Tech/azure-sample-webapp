// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import 'cypress-file-upload';
import { Downloads, Login, Scenarios, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { setup } from '../../commons/utils/setup';
import { stub } from '../../commons/services/stubbing';
import { DEFAULT_SCENARIOS_LIST } from '../../fixtures/stubbing/default';

const CSV_VALID_FILE_PATH_EMPTY = 'customers_empty.csv';
const CSV_VALID_FILE_PATH_WITH_SPACES = 'customers_with_spaces.csv';
const XLSX_VALID_FILE_PATH_EMPTY = 'customers_empty.xlsx';

const COL_NAMES = ['name', 'age', 'canDrinkAlcohol', 'favoriteDrink', 'birthday', 'height'];

describe('Table parameters files standard operations part 1', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
    });
    Login.login();
  });

  beforeEach(() => {
    Login.relogin();
  });

  after(() => {
    Downloads.clearDownloadsFolder();
    stub.stop();
  });

  it('can open the customers scenario parameters tab, and export an empty grid', () => {
    Scenarios.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);
    ScenarioParameters.expandParametersAccordion();
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

  it('can import empty CSV & XLSX files and export the table afterwards', () => {
    Scenarios.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);
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
    ScenarioParameters.edit();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableHeader().should('not.exist');
    BreweryParameters.importCustomersTableData(CSV_VALID_FILE_PATH_EMPTY);
    checkAndExport();
    BreweryParameters.importCustomersTableData(XLSX_VALID_FILE_PATH_EMPTY);
    checkAndExport();
  });

  it('can import a CSV file with spaces and boolean values to re-format', () => {
    Scenarios.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);
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
