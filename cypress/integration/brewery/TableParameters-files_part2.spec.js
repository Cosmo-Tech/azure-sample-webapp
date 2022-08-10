// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import 'cypress-file-upload';
import utils from '../../commons/TestUtils';

import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { Downloads, Login, Scenarios, ScenarioManager, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { EXPECTED_CUSTOMERS_BASIC_EDITION } from '../../fixtures/TableParametersData';

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});

const SCENARIO_DATASET = DATASET.BREWERY_ADT;
const SCENARIO_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;
const CSV_VALID_FILE_PATH = 'customers.csv';
const CSV_ALTERNATE_VALID_FILE_PATH = 'customers2.csv';

function forgeScenarioName() {
  const prefix = 'Scenario with table - ';
  const randomString = utils.randomStr(7);
  return prefix + randomString;
}

describe('Table parameters files standard operations part 2', () => {
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

  it('must check the edition mode to accept changes, and let users discards their changes', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    ScenarioParameters.edit();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.importCustomersTableData(CSV_VALID_FILE_PATH);
    BreweryParameters.getCustomersTableRows().should('have.length', 4);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Bob');
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '10');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 1).should('have.text', 'false');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 2).should('have.text', 'Wine');
    BreweryParameters.getCustomersTableCell('birthday', 3).should('have.text', '12/05/1987');
    BreweryParameters.getCustomersTableCell('height', 3).should('have.text', '1.83');
    BreweryParameters.editCustomersTableStringCell('name', 0, 'Bill').should('have.text', 'Bob'); // notEditable
    BreweryParameters.editCustomersTableStringCell('age', 0, '11').should('have.text', '11');
    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, 'true').should('have.text', 'true');
    BreweryParameters.editCustomersTableStringCell('favoriteDrink', 2, 'Beer').should('have.text', 'Beer');
    BreweryParameters.editCustomersTableStringCell('birthday', 3, '01/01/1991').should('have.text', '01/01/1991');
    BreweryParameters.editCustomersTableStringCell('height', 3, '2.01').should('have.text', '2.01');
    ScenarioParameters.discard();
    BreweryParameters.getCustomersTableHeader().should('not.exist');
    ScenarioParameters.edit();
    BreweryParameters.importCustomersTableData(CSV_VALID_FILE_PATH);
    BreweryParameters.getCustomersTableRows().should('have.length', 4);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Bob');
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '10');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 1).should('have.text', 'false');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 2).should('have.text', 'Wine');
    BreweryParameters.getCustomersTableCell('birthday', 3).should('have.text', '12/05/1987');
    BreweryParameters.getCustomersTableCell('height', 3).should('have.text', '1.83');
    BreweryParameters.editCustomersTableStringCell('name', 0, 'Bill').should('have.text', 'Bob'); // notEditable
    BreweryParameters.editCustomersTableStringCell('age', 0, '11').should('have.text', '11');
    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, 'true').should('have.text', 'true');
    BreweryParameters.editCustomersTableStringCell('favoriteDrink', 2, 'Beer').should('have.text', 'Beer');
    BreweryParameters.editCustomersTableStringCell('birthday', 3, '01/01/1991').should('have.text', '01/01/1991');
    BreweryParameters.editCustomersTableStringCell('height', 3, '2.01').should('have.text', '2.01');
    ScenarioParameters.updateAndLaunch();
    // Check that cells values have been saved
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Bob');
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '11');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 1).should('have.text', 'true');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 2).should('have.text', 'Beer');
    BreweryParameters.getCustomersTableCell('birthday', 3).should('have.text', '01/01/1991');
    BreweryParameters.getCustomersTableCell('height', 3).should('have.text', '2.01');
    // Check that cells are not editable when not in edition mode
    BreweryParameters.editCustomersTableStringCell('name', 0, 'Bill').should('have.text', 'Bob');
    BreweryParameters.editCustomersTableStringCell('age', 0, '12').should('have.text', '11');
    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, 'false').should('have.text', 'true');
    BreweryParameters.editCustomersTableStringCell('favoriteDrink', 2, 'Wine').should('have.text', 'Beer');
    BreweryParameters.editCustomersTableStringCell('birthday', 3, '04/04/1994').should('have.text', '01/01/1991');
    BreweryParameters.editCustomersTableStringCell('height', 3, '1.55').should('have.text', '2.01');
  });

  it('can import a CSV file, edit, export and launch a scenario with the modified data', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    ScenarioParameters.edit();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.importCustomersTableData(CSV_VALID_FILE_PATH);
    BreweryParameters.getCustomersTableRows().should('have.length', 4);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Bob');
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '10');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 1).should('have.text', 'false');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 2).should('have.text', 'Wine');
    BreweryParameters.getCustomersTableCell('birthday', 3).should('have.text', '12/05/1987');
    BreweryParameters.getCustomersTableCell('height', 3).should('have.text', '1.83');
    BreweryParameters.editCustomersTableStringCell('name', 0, 'Bill').should('have.text', 'Bob'); // notEditable
    BreweryParameters.editCustomersTableStringCell('age', 0, '11').should('have.text', '11');
    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, 'true').should('have.text', 'true');
    BreweryParameters.editCustomersTableStringCell('favoriteDrink', 2, 'Beer').should('have.text', 'Beer');
    BreweryParameters.editCustomersTableStringCell('birthday', 3, '01/01/1991').should('have.text', '01/01/1991');
    BreweryParameters.editCustomersTableStringCell('height', 3, '2.01').should('have.text', '2.01');
    BreweryParameters.exportCustomersTableDataToCSV();
    Downloads.checkByContent('customers.csv', EXPECTED_CUSTOMERS_BASIC_EDITION);
    ScenarioParameters.updateAndLaunch();
    // Check that cells values have been saved
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Bob');
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '11');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 1).should('have.text', 'true');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 2).should('have.text', 'Beer');
    BreweryParameters.getCustomersTableCell('birthday', 3).should('have.text', '01/01/1991');
    BreweryParameters.getCustomersTableCell('height', 3).should('have.text', '2.01');
  });

  it('can import a CSV file, edit it, import a new CSV file and override the first one, update and launch', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    ScenarioParameters.edit();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.importCustomersTableData(CSV_VALID_FILE_PATH);
    BreweryParameters.getCustomersTableRows().should('have.length', 4);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Bob');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 0).should('have.text', 'false');
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '10');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 0).should('have.text', 'AppleJuice');

    BreweryParameters.editCustomersTableStringCell('age', 0, '22').should('have.text', '22');
    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 0, 'true').should('have.text', 'true');
    BreweryParameters.editCustomersTableStringCell('favoriteDrink', 0, 'Beer').should('have.text', 'Beer');

    BreweryParameters.importCustomersTableData(CSV_ALTERNATE_VALID_FILE_PATH);
    BreweryParameters.getCustomersTableRows().should('have.length', 6);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Emmett');
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '69');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 0).should('have.text', 'OrangeJuice');
    BreweryParameters.getCustomersTableCell('name', 4).should('have.text', 'Dwight');
    BreweryParameters.getCustomersTableCell('name', 5).should('have.text', 'Arnold');
    ScenarioParameters.updateAndLaunch();

    // Check that imported file and its cells values are still correct
    BreweryParameters.getCustomersTableRows().should('have.length', 6);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Emmett');
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '69');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 0).should('have.text', 'OrangeJuice');
    BreweryParameters.getCustomersTableCell('name', 4).should('have.text', 'Dwight');
    BreweryParameters.getCustomersTableCell('name', 5).should('have.text', 'Arnold');
  });
});
