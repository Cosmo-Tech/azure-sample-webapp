// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Scenarios, ScenarioParameters, TableParameters, Login } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { SOLUTIONS } from '../../fixtures/stubbing/TableParameters-fullscreen/solutions';

const getFullscreenTable = TableParameters.getFullscreenTable;

const getVipCustomersTable = () => {
  return cy.get('[data-cy=table-vipCustomers]');
};

describe('check every TableToolbar component', () => {
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

  it('can edit table cells anc check changed values, with fullscreen mode enabled & disabled', () => {
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.importCustomersTableData('customers.csv');
    TableParameters.importFile(getVipCustomersTable(), 'customers.csv');

    BreweryParameters.getCustomersFullscreenButton().should('be.visible');
    BreweryParameters.enterCustomersFullscreen();
    TableParameters.editStringCell(getFullscreenTable, 'age', 0, '11').should('have.text', '11');
    TableParameters.editStringCell(getFullscreenTable, 'canDrinkAlcohol', 0, 'true', true).should('have.text', 'true');
    TableParameters.editStringCell(getFullscreenTable, 'favoriteDrink', 0, 'Wine', true).should('have.text', 'Wine');
    TableParameters.editStringCell(getFullscreenTable, 'birthday', 0, '02/05/2012', true).should(
      'have.text',
      '02/05/2012'
    );
    BreweryParameters.exitCustomersFullscreen();

    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '11');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 0).should('have.text', 'true');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 0).should('have.text', 'Wine');
    BreweryParameters.getCustomersTableCell('birthday', 0).should('have.text', '02/05/2012');

    TableParameters.getCell(getVipCustomersTable(), 'age', 0).should('have.text', '10');
    TableParameters.getCell(getVipCustomersTable(), 'canDrinkAlcohol', 0).should('have.text', 'false');

    BreweryParameters.editCustomersTableStringCell('age', 1, '9').should('have.text', '9');
    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, 'true').should('have.text', 'true');
    BreweryParameters.editCustomersTableStringCell('favoriteDrink', 2, 'AppleJuice').should('have.text', 'AppleJuice');
    BreweryParameters.editCustomersTableStringCell('birthday', 2, '13/06/1988').should('have.text', '13/06/1988');

    BreweryParameters.enterCustomersFullscreen();
    TableParameters.getCell(getFullscreenTable(), 'age', 1).should('have.text', '9');
    TableParameters.getCell(getFullscreenTable(), 'canDrinkAlcohol', 1).should('have.text', 'true');
    TableParameters.getCell(getFullscreenTable(), 'favoriteDrink', 2).should('have.text', 'AppleJuice');
    TableParameters.getCell(getFullscreenTable(), 'birthday', 2).should('have.text', '13/06/1988');
    cy.get('body').type('{esc}');

    TableParameters.toggleFullscreenButton(getVipCustomersTable());
    TableParameters.getCell(getVipCustomersTable(), 'age', 0).should('have.text', '10');
    TableParameters.getCell(getVipCustomersTable(), 'canDrinkAlcohol', 0).should('have.text', 'false');
    cy.get('body').type('{esc}');
  });
});
