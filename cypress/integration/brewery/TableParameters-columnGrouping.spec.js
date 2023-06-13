// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Scenarios, ScenarioParameters, Login } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { SOLUTIONS } from '../../fixtures/stubbing/TableParameters-columnGrouping/solution';

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
    cy.get('.ag-header-group-cell-label:first').within(() => {
      cy.get('.ag-header-group-text').should('have.text', 'GroupToSearch');
    });
  });
});
