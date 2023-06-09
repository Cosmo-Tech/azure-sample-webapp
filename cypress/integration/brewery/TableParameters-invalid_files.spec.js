// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { ScenarioSelector, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters, Login } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { DEFAULT_SCENARIOS_LIST } from '../../fixtures/stubbing/default';

const CSV_INVALID_FILE_PATH = 'customers_invalid.csv';
const XLSX_INVALID_FILE_PATH = 'customers_invalid.xlsx';

const EXPECTED_ERRORS_ON_CSV_IMPORT = [
  { summary: 'Too few fields', loc: 'Line 2' },
  { summary: 'Incorrect int value', loc: 'Line 3 , Column 2 ("age")' },
  { summary: 'Incorrect bool value' },
  { summary: 'Incorrect enum value' },
  { summary: 'Incorrect date value' },
  { summary: 'Incorrect number value' },
  { summary: 'Incorrect int value' },
  { summary: 'Incorrect bool value' },
  { summary: 'Incorrect enum value' },
  { summary: 'Incorrect date value' },
  { summary: 'Incorrect number value' },
];

const EXPECTED_ERRORS_ON_XLSX_IMPORT = [
  { summary: 'Empty field', loc: 'Line 2, Column 3 ("canDrinkAlcohol")' },
  { summary: 'Empty field', loc: 'Line 2, Column 4 ("favoriteDrink")' },
  { summary: 'Incorrect int value', loc: 'Line 3 , Column 2 ("age")' },
  { summary: 'Incorrect bool value' },
  { summary: 'Incorrect enum value' },
  { summary: 'Incorrect date value' },
  { summary: 'Incorrect number value' },
  { summary: 'Incorrect int value' },
  { summary: 'Incorrect bool value' },
  { summary: 'Incorrect enum value' },
  { summary: 'Incorrect date value' },
  { summary: 'Incorrect number value' },
];

describe('Table parameters invalid files operations', () => {
  before(() => {
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
    stub.stop();
  });

  it('can import invalid files and display the errors panel', () => {
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersImportButton().should('be.visible');
    BreweryParameters.getCustomersExportButton().should('be.visible');
    BreweryParameters.getCustomersErrorsPanel().should('not.exist');
    BreweryParameters.importCustomersTableData(CSV_INVALID_FILE_PATH);
    BreweryParameters.checkCustomersErrorsPanelFromList(EXPECTED_ERRORS_ON_CSV_IMPORT);
    BreweryParameters.importCustomersTableData(XLSX_INVALID_FILE_PATH);
    BreweryParameters.checkCustomersErrorsPanelFromList(EXPECTED_ERRORS_ON_XLSX_IMPORT);
    ScenarioParameters.discard();
    BreweryParameters.getCustomersErrorsPanel().should('not.exist');
  });
});
