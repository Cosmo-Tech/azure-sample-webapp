// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Scenarios, ScenarioParameters, Login, TableParameters } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { SOLUTIONS } from '../../fixtures/stubbing/TableParameters-add_delete_rows/solution';

const getCustomersStubbedTable = () => cy.get('[data-cy=table-customers-stub]');

describe('Testing add and delete features on different index', () => {
  before(() => {
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
      GET_WORKSPACES: true,
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

  it('Import a table, add rows then delete and check if lines have been deleted', () => {
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
    // Test to delete with no selected rows (will delete no one)
    BreweryParameters.deleteRowsCustomersTableData();
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
});
