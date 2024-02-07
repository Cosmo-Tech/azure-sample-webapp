// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { Downloads, ScenarioManager, ScenarioParameters, Scenarios } from '../../commons/actions';
import { BreweryParameters, Login } from '../../commons/actions/brewery';
import { ScenarioSelector } from '../../commons/actions/generic/ScenarioSelector';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { EXPECTED_CUSTOMERS_INHERITED_TABLE } from '../../fixtures/TableParametersData';

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});

const SCENARIO_DATASET = DATASET.BREWERY_ADT;
const SCENARIO_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;
const MASTER_CSV_FILE_PATH = 'customers.csv';
const CHILD_CSV_FILE_PATH = 'customers2.csv';

function forgeScenarioName() {
  const prefix = 'Test Cypress - child scenario with table - ';
  const randomString = utils.randomStr(7);
  return prefix + randomString;
}
describe('Table parameters inheritance between parent and child scenarios', () => {
  let masterScenarioId, firstChildScenarioId;

  beforeEach(() => {
    Login.login();
  });
  const scenarioNamesToDelete = [];
  after(() => {
    Downloads.clearDownloadsFolder();

    ScenarioManager.deleteScenarioList(scenarioNamesToDelete);
  });
  it('checks that child scenario inherits from its parent table parameters with inline editing', () => {
    const masterScenario = 'Test Cypress - master scenario with table - ' + utils.randomStr(7);
    scenarioNamesToDelete.push(masterScenario);
    Scenarios.createScenario(masterScenario, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE).then((data) => {
      masterScenarioId = data.scenarioCreatedId;
      ScenarioParameters.expandParametersAccordion();
      BreweryParameters.switchToCustomersTab();
      ScenarioParameters.expandParametersAccordion();
      BreweryParameters.importCustomersTableData(MASTER_CSV_FILE_PATH);
      BreweryParameters.getCustomersTableRows().should('have.length', 4);
      BreweryParameters.editCustomersTableStringCell('age', 0, '78').should('have.text', '78');
      BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, 'true').should('have.text', 'true');
      BreweryParameters.editCustomersTableStringCell('height', 0, '2.01').should('have.text', '2.01');
      ScenarioParameters.save();
      const firstChildScenario = forgeScenarioName();
      Scenarios.createScenario(firstChildScenario, false, masterScenario, SCENARIO_RUN_TEMPLATE).then((data) => {
        firstChildScenarioId = data.scenarioCreatedId;
        scenarioNamesToDelete.push(firstChildScenario);
        BreweryParameters.switchToCustomersTab();
        BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '78');
        BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 1).should('have.text', 'true');
        BreweryParameters.getCustomersTableCell('height', 0).should('have.text', '2.01');
        BreweryParameters.exportCustomersTableDataToCSV();
        Downloads.checkByContent('customers.csv', EXPECTED_CUSTOMERS_INHERITED_TABLE);
        ScenarioParameters.expandParametersAccordion();
        BreweryParameters.editCustomersTableStringCell('age', 0, '56').should('have.text', '56');
        BreweryParameters.editCustomersTableStringCell('height', 0, '1.7').should('have.text', '1.7');
        BreweryParameters.editCustomersTableStringCell('favoriteDrink', 0, 'Wine').should('have.text', 'Wine');
        ScenarioParameters.save();
        const secondChildScenario = forgeScenarioName();
        scenarioNamesToDelete.push(secondChildScenario);
        Scenarios.createScenario(secondChildScenario, false, masterScenario, SCENARIO_RUN_TEMPLATE);
        BreweryParameters.switchToCustomersTab();
        BreweryParameters.getCustomersTableCell('age', 0).should('not.have.text', '56');
        BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '78');
        BreweryParameters.getCustomersTableCell('favoriteDrink', 0).should('not.have.text', 'Wine');
        BreweryParameters.getCustomersTableCell('favoriteDrink', 0).should('have.text', 'AppleJuice');
        BreweryParameters.getCustomersTableCell('height', 0).should('not.have.text', '1.7');
        BreweryParameters.getCustomersTableCell('height', 0).should('have.text', '2.01');
        ScenarioParameters.expandParametersAccordion();
        BreweryParameters.importCustomersTableData(CHILD_CSV_FILE_PATH);
        BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Emmett');
        BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '69');
        BreweryParameters.getCustomersTableCell('favoriteDrink', 0).should('have.text', 'OrangeJuice');
        ScenarioParameters.save();
        ScenarioSelector.selectScenario(masterScenario, masterScenarioId);
        BreweryParameters.switchToCustomersTab();
        BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Bob');
        BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '78');
        BreweryParameters.getCustomersTableCell('favoriteDrink', 0).should('have.text', 'AppleJuice');
        BreweryParameters.exportCustomersTableDataToCSV();
        ScenarioSelector.selectScenario(firstChildScenario, firstChildScenarioId);
        BreweryParameters.switchToCustomersTab();
        BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Bob');
        BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '56');
        BreweryParameters.getCustomersTableCell('favoriteDrink', 0).should('have.text', 'Wine');
      });
    });
  });
});
