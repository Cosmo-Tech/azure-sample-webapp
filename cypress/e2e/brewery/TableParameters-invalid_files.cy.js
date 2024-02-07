// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ScenarioSelector, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters, Login } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { DEFAULT_SCENARIOS_LIST } from '../../fixtures/stubbing/default';

const CSV_INVALID_FILE_PATH = 'customers_invalid.csv';
const XLSX_INVALID_FILE_PATH = 'customers_invalid.xlsx';
const CSV_TOO_MANY_FIELDS = 'customers_too_many_fields.csv';
const XLSX_TOO_MANY_FIELDS = 'customers_too_many_fields.xlsx';
const CSV_ONLY_NAME_FIELD = 'customers_only_name_field.csv';
const XLSX_ONLY_NAME_FIELD = 'customers_only_name_field.xlsx';

const expectedErrorsFew = [
  { summary: 'Incorrect int value', loc: 'Line 3, Column 2 ("age")' },
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

const expectedErrorsFewCSV = [{ summary: 'Too few fields', loc: 'Line 2' }, ...expectedErrorsFew];

const expectedErrorsFewXLSX = [
  { summary: 'Empty field', loc: 'Line 2, Column 3 ("canDrinkAlcohol")' },
  { summary: 'Empty field', loc: 'Line 2, Column 4 ("favoriteDrink")' },
  ...expectedErrorsFew,
];

const expectedErrorsManyXLSX = [
  { summary: 'Empty field', loc: 'Line 2, Column 1 ("name")' },
  { summary: 'Too many fields', loc: 'Line 2' },
  { summary: 'Empty field', loc: 'Line 3, Column 1 ("name")' },
  { summary: 'Too many fields', loc: 'Line 3' },
  { summary: 'Too many fields', loc: 'Line 4' },
  { summary: 'Too many fields', loc: 'Line 5' },
  { summary: 'Empty field', loc: 'Line 7, Column 4 ("favoriteDrink")' },
];

const expectedErrorsManyCSV = [...expectedErrorsManyXLSX, { summary: 'Too few fields', loc: 'Line 7' }];

const expectedErrorsOnlyNameField = [
  { summary: 'Too few fields', loc: 'Line 2' },
  { summary: 'Too few fields', loc: 'Line 3' },
  { summary: 'Too few fields', loc: 'Line 4' },
  { summary: 'Too few fields', loc: 'Line 5' },
];

describe('Table fields invalid files operations', () => {
  before(() => {
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
    });
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('can import invalid files with few, many or invalid fields and display the errors panel', () => {
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersImportButton().should('be.visible');
    BreweryParameters.getCustomersExportButton().should('be.visible');
    BreweryParameters.getCustomersErrorsPanel().should('not.exist');
    BreweryParameters.importCustomersTableData(CSV_INVALID_FILE_PATH);
    BreweryParameters.checkCustomersErrorsPanelFromList(expectedErrorsFewCSV);
    BreweryParameters.importCustomersTableData(XLSX_INVALID_FILE_PATH);
    BreweryParameters.checkCustomersErrorsPanelFromList(expectedErrorsFewXLSX);
    BreweryParameters.importCustomersTableData(CSV_TOO_MANY_FIELDS);
    BreweryParameters.checkCustomersErrorsPanelFromList(expectedErrorsManyCSV);
    BreweryParameters.importCustomersTableData(XLSX_TOO_MANY_FIELDS);
    BreweryParameters.checkCustomersErrorsPanelFromList(expectedErrorsManyXLSX);
    BreweryParameters.importCustomersTableData(CSV_ONLY_NAME_FIELD);
    BreweryParameters.checkCustomersErrorsPanelFromList(expectedErrorsOnlyNameField);
    BreweryParameters.importCustomersTableData(XLSX_ONLY_NAME_FIELD);
    BreweryParameters.checkCustomersErrorsPanelFromList(expectedErrorsOnlyNameField);
    ScenarioParameters.discard();
    BreweryParameters.getCustomersErrorsPanel().should('not.exist');
  });
});
