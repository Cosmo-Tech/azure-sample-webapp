// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Downloads, ScenarioSelector, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters, Login } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { EXPECTED_CUSTOMERS_AFTER_IMPORT_WITH_EMPTY_FIELDS } from '../../fixtures/TableParametersData';
import { DEFAULT_SCENARIOS_LIST } from '../../fixtures/stubbing/default';

const CSV_VALID_WITH_EMPTY_FIELDS = 'customers_empty_authorized_fields.csv';
const XLSX_INVALID_EMPTY_FIELDS = 'customers_empty_unauthorized_fields.xlsx';
const CSV_EVENTS = 'events.csv';

describe('Table parameters upload of valid and invalid files with empty fields', () => {
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
    Downloads.clearDownloadsFolder();
    stub.stop();
  });

  it('can import a table with authorized empty fields, clear and edit authorized field and export the table', () => {
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.importCustomersTableData(CSV_VALID_WITH_EMPTY_FIELDS);
    BreweryParameters.getCustomersTableRows().should('have.length', 8);
    BreweryParameters.getCustomersTableCell('age', 1).should('have.text', '26');
    BreweryParameters.getCustomersTableCell('age', 2).should('have.text', '');
    BreweryParameters.getCustomersTableCell('height', 2).should('have.text', '2');
    BreweryParameters.getCustomersTableCell('birthday', 3).should('have.text', '');
    BreweryParameters.getCustomersTableCell('birthday', 4).should('have.text', '09/09/1965');
    BreweryParameters.getCustomersTableCell('height', 4).should('have.text', '');
    BreweryParameters.clearCustomersTableStringCell('height', 2).should('have.text', '');
    BreweryParameters.clearCustomersTableStringCell('canDrinkAlcohol', 3).should('have.text', 'true');
    BreweryParameters.editCustomersTableStringCell('height', 3, '2').should('have.text', '2');
    BreweryParameters.clearCustomersTableStringCell('age', 5).should('have.text', '');
    BreweryParameters.clearCustomersTableStringCell('favoriteDrink', 5).should('have.text', 'Beer');
    BreweryParameters.editCustomersTableStringCell('birthday', 5, '15/08/1994').should('have.text', '15/08/1994');
    BreweryParameters.clearCustomersTableStringCell('favoriteDrink', 6).should('have.text', 'Beer');
    BreweryParameters.editCustomersTableStringCell('height', 6, '1.8').should('have.text', '1.8');
    BreweryParameters.exportCustomersTableDataToCSV();
    Downloads.checkByContent('customers.csv', EXPECTED_CUSTOMERS_AFTER_IMPORT_WITH_EMPTY_FIELDS);

    // Empty strings in columns of type "string"
    BreweryParameters.switchToEventsTab();
    BreweryParameters.importEventsTableData(CSV_EVENTS);
    BreweryParameters.getEventsTableRows().should('have.length', 5);
    BreweryParameters.getEventsTableCell('theme', 0).should('have.text', 'complex systems');
    BreweryParameters.clearEventsTableStringCell('theme', 0).should('have.text', 'complex systems');
  });

  it('can import invalid files and display errors', () => {
    const checkErrorsPanel = () => {
      const expectedErrors = [
        { summary: 'Empty field', loc: 'Line 2, Column 1 ("name")' },
        { summary: 'Empty field', loc: 'Line 4, Column 3 ("canDrinkAlcohol")' },
        { summary: 'Empty field', loc: 'Line 4, Column 4 ("favoriteDrink")' },
        { summary: 'Incorrect int value', loc: 'Line 4, Column 2 ("age")' },
        { summary: 'Empty field' },
        { summary: 'Incorrect enum value', loc: 'Line 6, Column 4 ("favoriteDrink")' },
        { summary: 'Incorrect number value' },
        { summary: 'Incorrect date value' },
        { summary: 'Empty field', loc: 'Line 9, Column 3 ("canDrinkAlcohol")' },
        { summary: 'Empty field', loc: 'Line 9, Column 4 ("favoriteDrink")' },
        { summary: 'Empty field', loc: 'Line 10, Column 1 ("name")' },
      ];
      BreweryParameters.checkCustomersErrorsPanelFromList(expectedErrors);
    };
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.importCustomersTableData(XLSX_INVALID_EMPTY_FIELDS);
    checkErrorsPanel();
    ScenarioParameters.discard();
    BreweryParameters.getCustomersErrorsPanel().should('not.exist');
  });
});
