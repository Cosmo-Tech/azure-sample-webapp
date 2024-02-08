// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Downloads, Scenarios, ScenarioParameters, Login, TableParameters } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { SOLUTIONS } from '../../fixtures/stubbing/TableParameters-add_delete_rows/solution';

const getCustomersStubbedTable = () => cy.get('[data-cy=table-customers-stub]');

const header = 'name,age,canDrinkAlcohol,favoriteDrink,birthday,height';
const EXPECTED_CSV_AFTER_ADDITION_IN_EMPTY_TABLE = header + '\ndefaultName,,false,AppleJuice,,';
const EXPECTED_CSV_AFTER_ADDITION_IN_SORTED_TABLE =
  header +
  '\n' +
  'Bob,10,false,AppleJuice,01/04/2011,1.40\n' +
  'Lily,8,false,AppleJuice,09/05/2013,1.41\n' +
  'Maria,34,true,Wine,19/03/1987,1.90\n' +
  'Howard,34,true,Beer,12/05/1987,1.83\n' +
  'defaultName,,false,AppleJuice,,'; // New lines in a sorted table are appended at the end

describe('Testing add and delete features on different index', () => {
  before(() => {
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
      GET_WORKSPACES: true,
      GET_ORGANIZATION: true,
      GET_SOLUTIONS: true,
      PERMISSIONS_MAPPING: true,
    });
    stub.setSolutions(SOLUTIONS);
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('can import a table, add rows and delete them', () => {
    localStorage.setItem('dontAskAgainToDeleteRow', false);
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.importCustomersTableData('customers.csv');
    BreweryParameters.getCustomersTableRows().should('have.length', 4);

    BreweryParameters.switchToEventsTab();
    TableParameters.importFile(getCustomersStubbedTable(), 'customers2.csv');
    TableParameters.getRows(getCustomersStubbedTable()).should('have.length', 6);
    TableParameters.getCell(getCustomersStubbedTable(), 'name', 0).click();
    TableParameters.deleteRows(getCustomersStubbedTable());
    TableParameters.getRows(getCustomersStubbedTable()).should('have.length', 5);
    BreweryParameters.switchToCustomersTab();

    BreweryParameters.addRowCustomersTableData();
    BreweryParameters.getCustomersTableCell('name', 4).click();
    BreweryParameters.addRowCustomersTableData();
    BreweryParameters.getCustomersTableCell('name', 1).click({ ctrlKey: true });
    BreweryParameters.getCustomersTableCell('name', 3).click({ ctrlKey: true });
    BreweryParameters.addRowCustomersTableData();
    BreweryParameters.getCustomersTableRows().should('have.length', 7);

    // This part of the test uses shift to select 3 lines then deletes them
    BreweryParameters.getCustomersTableCell('name', 0).click({ shiftKey: true });
    BreweryParameters.getCustomersTableCell('name', 2).click({ shiftKey: true });
    BreweryParameters.deleteRowsCustomersTableData(true);
    BreweryParameters.getCustomersTableRows().should('have.length', 4);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Maria');
    BreweryParameters.getCustomersTableCell('name', 0).click({ ctrlKey: true });
    BreweryParameters.getCustomersTableCell('name', 1).click({ ctrlKey: true });
    BreweryParameters.getCustomersTableCell('name', 3).click({ ctrlKey: true });
    BreweryParameters.deleteRowsCustomersTableData(true);
    BreweryParameters.getCustomersTableRows().should('have.length', 1);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Howard');
    BreweryParameters.getCustomersTableCell('name', 0).click();
    BreweryParameters.deleteRowsCustomersTableData();
    BreweryParameters.switchToEventsTab();
    TableParameters.getCell(getCustomersStubbedTable(), 'name', 0).click();
    TableParameters.deleteRows(getCustomersStubbedTable());
    TableParameters.getRows(getCustomersStubbedTable()).should('have.length', 4);
  });

  it('can add rows to an empty table, export its content and delete all rows', () => {
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableRowsContainer().should('not.exist');

    BreweryParameters.addRowCustomersTableData();
    BreweryParameters.getCustomersTableRowsContainer().should('exist');
    BreweryParameters.getCustomersTableRows().should('have.length', 1);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'defaultName');
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '');

    BreweryParameters.exportCustomersTableDataToCSV();
    Downloads.checkByContent('customers.csv', EXPECTED_CSV_AFTER_ADDITION_IN_EMPTY_TABLE);

    BreweryParameters.getCustomersTableCell('name', 0).click();
    BreweryParameters.deleteRowsCustomersTableData();
    BreweryParameters.getCustomersTableRowsContainer().should('not.exist');

    BreweryParameters.addRowCustomersTableData();
    BreweryParameters.addRowCustomersTableData();
    BreweryParameters.addRowCustomersTableData();
    BreweryParameters.getCustomersTableRows().should('have.length', 3);

    BreweryParameters.getCustomersTableCell('name', 0).click({ shiftKey: true });
    BreweryParameters.getCustomersTableCell('name', 2).click({ shiftKey: true });
    BreweryParameters.deleteRowsCustomersTableData(true);
    BreweryParameters.getCustomersTableRowsContainer().should('not.exist');
  });

  it('can add lines in a sorted table, export its content and delete rows', () => {
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    // Import CSV with 4 rows. Age values are 10 (Bob), 8 (Lily), 34 (Maria) and 34 (Howard)
    BreweryParameters.importCustomersTableData('customers.csv');
    BreweryParameters.getCustomersTableRows().should('have.length', 4);
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '10');
    BreweryParameters.getCustomersTableCell('age', 1).should('have.text', '8');
    // Filter by age in asc. order. Sorted age values are 8 (Lily), 10 (Bob), 34 (Howard) and 34 (Maria)
    BreweryParameters.getCustomersTableHeaderCell('age').click(); // Trigger filter once
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '8');
    BreweryParameters.getCustomersTableCell('age', 1).should('have.text', '10');

    BreweryParameters.getCustomersTableCell('age', 1).click();
    BreweryParameters.addRowCustomersTableData();
    BreweryParameters.getCustomersTableRows().should('have.length', 5);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'defaultName');
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '');
    BreweryParameters.getCustomersTableCell('age', 1).should('have.text', '8');
    BreweryParameters.getCustomersTableCell('age', 2).should('have.text', '10');

    BreweryParameters.exportCustomersTableDataToCSV();
    Downloads.checkByContent('customers.csv', EXPECTED_CSV_AFTER_ADDITION_IN_SORTED_TABLE);

    // Delete the line that has just been created
    BreweryParameters.getCustomersTableCell('age', 0).click();
    BreweryParameters.deleteRowsCustomersTableData();
    BreweryParameters.getCustomersTableRows().should('have.length', 4);
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '8');
    BreweryParameters.getCustomersTableCell('age', 1).should('have.text', '10');
    BreweryParameters.getCustomersTableCell('age', 2).should('have.text', '34');
  });
});
