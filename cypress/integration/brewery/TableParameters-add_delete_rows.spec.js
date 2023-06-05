// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Scenarios, ScenarioParameters, Login } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { SOLUTIONS } from '../../fixtures/stubbing/TableParameters-add_delete_rows/solution';

describe('check if column grouping feature still up', () => {
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

  it('Look if column grouping is successfully displayed and visible', () => {
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.importCustomersTableData('customers.csv');
    BreweryParameters.getCustomersTableRows().should('have.length', 4);

    BreweryParameters.addRowCustomersTableData();
    BreweryParameters.getCustomersTableCell('name', 4).click();
    BreweryParameters.addRowCustomersTableData();
    BreweryParameters.getCustomersTableCell('name', 1).click({ ctrlKey: true });
    BreweryParameters.getCustomersTableCell('name', 3).click({ ctrlKey: true });
    BreweryParameters.addRowCustomersTableData();
    BreweryParameters.getCustomersTableRows().should('have.length', 7);
    BreweryParameters.deleteRowsCustomersTableData();
    BreweryParameters.getCustomersTableRows().should('have.length', 7);
    BreweryParameters.getCustomersTableCell('name', 0).click({ shiftKey: true });
    BreweryParameters.getCustomersTableCell('name', 2).click({ shiftKey: true });
    BreweryParameters.deleteRowsCustomersTableData();
    BreweryParameters.getCustomersTableRows().should('have.length', 4);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Maria');
    BreweryParameters.getCustomersTableCell('name', 0).click({ ctrlKey: true });
    BreweryParameters.getCustomersTableCell('name', 1).click({ ctrlKey: true });
    BreweryParameters.getCustomersTableCell('name', 3).click({ ctrlKey: true });
    BreweryParameters.deleteRowsCustomersTableData();
    BreweryParameters.getCustomersTableRows().should('have.length', 1);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Howard');
    BreweryParameters.getCustomersTableCell('name', 0).click();
    BreweryParameters.deleteRowsCustomersTableData();
    BreweryParameters.getCustomersTableRows().should('have.length', 0);
  });
});
