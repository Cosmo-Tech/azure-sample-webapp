// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { Downloads, Scenarios, ScenarioManager, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters, Login } from '../../commons/actions/brewery';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { EXPECTED_CUSTOMERS_AFTER_XLSX_IMPORT } from '../../fixtures/TableParametersData';

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});

const SCENARIO_DATASET = DATASET.BREWERY_ADT;
const SCENARIO_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;
const CSV_VALID_FILE_PATH = 'customers.csv';
const XLSX_VALID_FILE_PATH = 'customers.xlsx';

const ENUM_VALUES = ['AppleJuice', 'OrangeJuice', 'Wine', 'Beer'];

function forgeScenarioName() {
  const prefix = 'Scenario with table - ';
  const randomString = utils.randomStr(7);
  return prefix + randomString;
}

describe('Table parameters files standard operations part 3', () => {
  beforeEach(() => {
    Login.login();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    Downloads.clearDownloadsFolder();
    ScenarioManager.deleteScenarioList(scenarioNamesToDelete);
  });

  it('can import an XLSX file, edit, export and save a scenario with the modified data', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.importCustomersTableData(XLSX_VALID_FILE_PATH);
    BreweryParameters.getCustomersTableRows().should('have.length', 5);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Bob');
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '10');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 1).should('have.text', 'false');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 2).should('have.text', 'Wine');
    BreweryParameters.getCustomersTableCell('birthday', 3).should('have.text', '12/05/1987');
    BreweryParameters.getCustomersTableCell('height', 3).should('have.text', '1.83');
    BreweryParameters.editCustomersTableStringCell('name', 0, 'Bill').should('have.text', 'Bill');
    BreweryParameters.editCustomersTableStringCell('age', 0, '11').should('have.text', '11');
    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, 'true').should('have.text', 'true');
    BreweryParameters.editCustomersTableStringCell('favoriteDrink', 2, 'Beer').should('have.text', 'Beer');
    BreweryParameters.editCustomersTableStringCell('birthday', 3, '01/01/1991').should('have.text', '01/01/1991');
    BreweryParameters.editCustomersTableStringCell('height', 3, '2.01').should('have.text', '2.01');
    BreweryParameters.exportCustomersTableDataToCSV();
    Downloads.checkByContent('customers.csv', EXPECTED_CUSTOMERS_AFTER_XLSX_IMPORT);
    ScenarioParameters.save();
    // Check that cells values have been saved
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Bill');
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '11');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 1).should('have.text', 'true');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 2).should('have.text', 'Beer');
    BreweryParameters.getCustomersTableCell('birthday', 3).should('have.text', '01/01/1991');
    BreweryParameters.getCustomersTableCell('height', 3).should('have.text', '2.01');
  });

  it('must accept valid values and reject invalid values based on columns type', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.importCustomersTableData(CSV_VALID_FILE_PATH);
    // Initial values
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '10');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 1).should('have.text', 'false');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 2).should('have.text', 'Wine');
    BreweryParameters.getCustomersTableCell('birthday', 3).should('have.text', '12/05/1987');
    BreweryParameters.getCustomersTableCell('height', 3).should('have.text', '1.83');
    // Invalid values
    BreweryParameters.editCustomersTableStringCell('age', 0, 'foo').should('have.text', '10');
    BreweryParameters.editCustomersTableStringCell('age', 0, '.36').should('have.text', '10');
    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, '').should('have.text', 'false');
    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, 'foo').should('have.text', 'false');
    BreweryParameters.editCustomersTableStringCell('favoriteDrink', 2, '').should('have.text', 'Wine');
    BreweryParameters.editCustomersTableStringCell('favoriteDrink', 2, 'foo').should('have.text', 'Wine');
    BreweryParameters.editCustomersTableStringCell('birthday', 3, 'foo').should('have.text', '12/05/1987');
    BreweryParameters.editCustomersTableStringCell('birthday', 3, '1991-01-01').should('have.text', '12/05/1987');
    BreweryParameters.editCustomersTableStringCell('birthday', 3, '31/31/1991').should('have.text', '12/05/1987');
    BreweryParameters.editCustomersTableStringCell('birthday', 3, '31/02/1991').should('have.text', '12/05/1987');
    BreweryParameters.editCustomersTableStringCell('height', 3, 'foo').should('have.text', '1.83');
    BreweryParameters.editCustomersTableStringCell('height', 3, '*55').should('have.text', '1.83');
    // Valid values
    BreweryParameters.editCustomersTableStringCell('age', 0, '').should('have.text', '');
    BreweryParameters.editCustomersTableStringCell('birthday', 3, '').should('have.text', '');
    BreweryParameters.editCustomersTableStringCell('height', 3, '').should('have.text', '');
    BreweryParameters.editCustomersTableStringCell('age', 0, '0').should('have.text', '0');
    BreweryParameters.clearCustomersTableStringCell('age', 0, false).should('have.text', '');
    BreweryParameters.editCustomersTableStringCell('age', 0, '50abc').should('have.text', '50');
    BreweryParameters.clearCustomersTableStringCell('age', 0, true).should('have.text', '');
    BreweryParameters.editCustomersTableStringCell('age', 0, '119').should('have.text', '119');
    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, '1').should('have.text', 'true');
    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, '0').should('have.text', 'false');
    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, 'yes').should('have.text', 'true');
    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, 'no').should('have.text', 'false');
    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, 'truE').should('have.text', 'true');
    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, 'falSe').should('have.text', 'false');
    ENUM_VALUES.forEach((enumValue) => {
      BreweryParameters.editCustomersTableStringCell('favoriteDrink', 2, enumValue).should('have.text', enumValue);
    });
    BreweryParameters.editCustomersTableStringCell('birthday', 3, '01/01/1991').should('have.text', '01/01/1991');
    BreweryParameters.editCustomersTableStringCell('birthday', 3, '12/12/2012').should('have.text', '12/12/2012');
    BreweryParameters.editCustomersTableStringCell('height', 3, '0').should('have.text', '0');
    BreweryParameters.editCustomersTableStringCell('height', 3, '0.00').should('have.text', '0');
    BreweryParameters.editCustomersTableStringCell('height', 3, '.15').should('have.text', '0.15');
    BreweryParameters.editCustomersTableStringCell('height', 3, '2.15').should('have.text', '2.15');
    // Min & max values
    BreweryParameters.editCustomersTableStringCell('age', 0, '121').should('have.text', '120');
    BreweryParameters.editCustomersTableStringCell('age', 0, '-1').should('have.text', '0');
    BreweryParameters.editCustomersTableStringCell('birthday', 3, '31/12/1899').should('have.text', '01/01/1900');
    BreweryParameters.editCustomersTableStringCell('birthday', 3, '01/01/3000')
      .should('not.have.text', '01/01/1900')
      .should('not.have.text', '01/01/3000');
    BreweryParameters.editCustomersTableStringCell('height', 3, '-5').should('have.text', '0');
    BreweryParameters.editCustomersTableStringCell('height', 3, '10').should('have.text', '2.5');
    ScenarioParameters.discard();
  });

  it('can use undo/redo during table edition', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.importCustomersTableData(CSV_VALID_FILE_PATH);
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 1).should('have.text', 'false');
    // Add 1 edit to circumvent bug in ag-grid (the first edit seems not to be in the undo history)
    // TODO: remove work-around when bug is fixed
    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, 'true');
    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, 'false');

    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, 'true')
      .should('have.text', 'true')
      .type('{ctrl}z')
      .should('have.text', 'false');
    ScenarioParameters.discard();
  });
});
