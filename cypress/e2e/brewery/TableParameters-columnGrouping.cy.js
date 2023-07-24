// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Scenarios, ScenarioParameters, Login } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { SOLUTIONS } from '../../fixtures/stubbing/TableParameters-columnGrouping/solution';

describe('check if column grouping is displayed in the stubbed Table component', () => {
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

  // eslint-disable-next-line max-len
  it('looks if column grouping is successfully displayed and visible, and column property is written on cellEditorParams key', () => {
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.importCustomersTableData('customers.csv');
    BreweryParameters.getCustomersColumnGroup(1).should('exist');
    BreweryParameters.getCustomersTableCell('name', 0).should('exist');
    BreweryParameters.getCustomersTableCell('age', 0).should('not.exist');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 0).should('exist');
    BreweryParameters.openCustomersColumnGroup(1);
    BreweryParameters.getCustomersTableCell('name', 0).should('not.exist');
    BreweryParameters.getCustomersTableCell('age', 0).should('exist');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 0).should('exist');
  });
});
