// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import utils from '../../commons/TestUtils';

import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { Downloads, Login, Scenarios, ScenarioManager, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { EXPECTED_CUSTOMERS_AFTER_IMPORT_WITH_EMPTY_FIELDS } from '../../fixtures/TableParametersData';

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});

const SCENARIO_DATASET = DATASET.BREWERY_ADT;
const SCENARIO_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;
const CSV_VALID_WITH_EMPTY_FIELDS = 'customers_empty_authorized_fields.csv';
const XLSX_INVALID_EMPTY_FIELDS = 'customers_empty_unauthorized_fields.xlsx';

function forgeScenarioName() {
  const prefix = 'Scenario with table - ';
  const randomString = utils.randomStr(7);
  return prefix + randomString;
}

describe('Table parameters upload of valid and invalid files with empty fields', () => {
  before(() => {
    Login.login();
  });

  beforeEach(() => {
    Login.relogin();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    Downloads.clearDownloadsFolder();

    ScenarioManager.switchToScenarioManager();
    for (const scenarioName of scenarioNamesToDelete) {
      ScenarioManager.deleteScenario(scenarioName);
    }
  });

  it('can import a table with authorised empty fields, clear and edit authorized field and export the table', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    ScenarioParameters.edit();
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
    BreweryParameters.clearCustomersTableStringCell('height', 7).should('have.text', '');
    BreweryParameters.exportCustomersTableDataToCSV();
    Downloads.checkByContent('customers.csv', EXPECTED_CUSTOMERS_AFTER_IMPORT_WITH_EMPTY_FIELDS);
  });

  it('can import invalid files and display errors', () => {
    const checkErrorsPanel = () => {
      const expectedErrors = [
        { summary: 'Missing field', loc: 'Line 1' },
        { summary: 'Missing fields', loc: 'Line 3' },
        { summary: 'Incorrect int value', loc: 'Line 3 , Column 1 ("age")' },
        { summary: 'Missing field' },
        { summary: 'Incorrect enum value', loc: 'Line 5 , Column 3 ("favoriteDrink")' },
        { summary: 'Incorrect number value' },
        { summary: 'Incorrect date value' },
        { summary: 'Missing fields' },
      ];
      BreweryParameters.checkCustomersErrorsPanelFromList(expectedErrors);
    };

    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    ScenarioParameters.edit();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.importCustomersTableData(XLSX_INVALID_EMPTY_FIELDS);
    checkErrorsPanel();
    ScenarioParameters.discard();
    BreweryParameters.getCustomersErrorsPanel().should('not.exist');
  });
});
