// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { Downloads, Scenarios, ScenarioManager, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters, Login } from '../../commons/actions/brewery';
import { BREWERY_WORKSPACE_ID, DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { API_REGEX } from '../../commons/constants/generic/TestConstants';
import { routeUtils as route } from '../../commons/utils';
import {
  EXPECTED_CUSTOMERS_BASIC_EDITION,
  EXPECTED_CUSTOMERS_BASIC_EDITION_DATA,
} from '../../fixtures/TableParametersData';

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});

const SCENARIO_DATASET = DATASET.BREWERY_ADT;
const SCENARIO_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;
const CSV_VALID_FILE_PATH = 'customers.csv';
const CSV_ALTERNATE_VALID_FILE_PATH = 'customers2.csv';
const CSV_WRONG_HEADER_FILE_PATH = 'customers_valid_with_wrong_header.csv';

function forgeScenarioName() {
  const prefix = 'Scenario with table - ';
  const randomString = utils.randomStr(7);
  return prefix + randomString;
}

describe('Table parameters files standard operations part 2', () => {
  beforeEach(() => {
    Login.login();
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

    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.importCustomersTableData(CSV_VALID_FILE_PATH);
    BreweryParameters.getCustomersTableRows().should('have.length', 4);
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
    ScenarioParameters.discard();
    BreweryParameters.getCustomersTableHeader().should('not.exist');

    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.importCustomersTableData(CSV_VALID_FILE_PATH);
    BreweryParameters.getCustomersTableRows().should('have.length', 4);
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
    ScenarioParameters.save();

    // Check that cells values have been saved
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Bill');
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '11');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 1).should('have.text', 'true');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 2).should('have.text', 'Beer');
    BreweryParameters.getCustomersTableCell('birthday', 3).should('have.text', '01/01/1991');
    BreweryParameters.getCustomersTableCell('height', 3).should('have.text', '2.01');

    // Check that cells are not editable when not in edition mode
    Scenarios.validateScenario();
    BreweryParameters.editCustomersTableStringCell('name', 0, 'Bill').should('have.text', 'Bill');
    BreweryParameters.editCustomersTableStringCell('age', 0, '12').should('have.text', '11');
    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, 'false').should('have.text', 'true');
    BreweryParameters.editCustomersTableStringCell('favoriteDrink', 2, 'Wine').should('have.text', 'Beer');
    BreweryParameters.editCustomersTableStringCell('birthday', 3, '04/04/1994').should('have.text', '01/01/1991');
    BreweryParameters.editCustomersTableStringCell('height', 3, '1.55').should('have.text', '2.01');
  });

  it('can import a CSV file, edit, export, save a scenario with the modified data and re-export', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.importCustomersTableData(CSV_VALID_FILE_PATH);
    BreweryParameters.getCustomersTableRows().should('have.length', 4);
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
    Downloads.checkByContent('customers.csv', EXPECTED_CUSTOMERS_BASIC_EDITION);
    BreweryParameters.exportCustomersTableDataToXLSX();
    Downloads.checkXLSXByContent('customers.xlsx', EXPECTED_CUSTOMERS_BASIC_EDITION_DATA);

    ScenarioParameters.save();

    // Check that cells values have been saved
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Bill');
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '11');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 1).should('have.text', 'true');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 2).should('have.text', 'Beer');
    BreweryParameters.getCustomersTableCell('birthday', 3).should('have.text', '01/01/1991');
    BreweryParameters.getCustomersTableCell('height', 3).should('have.text', '2.01');
    BreweryParameters.exportCustomersTableDataToCSV('customFileName');
    Downloads.checkByContent('customFileName.csv', EXPECTED_CUSTOMERS_BASIC_EDITION);
    BreweryParameters.exportCustomersTableDataToXLSX('customFileName');
    Downloads.checkXLSXByContent('customFileName.xlsx', EXPECTED_CUSTOMERS_BASIC_EDITION_DATA);
  });

  it('can import a CSV file, edit it, import a new CSV file and override the first one and save', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    ScenarioParameters.expandParametersAccordion();
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
    ScenarioParameters.save();

    // Check that imported file and its cells values are still correct
    BreweryParameters.getCustomersTableRows().should('have.length', 6);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Emmett');
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '69');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 0).should('have.text', 'OrangeJuice');
    BreweryParameters.getCustomersTableCell('name', 4).should('have.text', 'Dwight');
    BreweryParameters.getCustomersTableCell('name', 5).should('have.text', 'Arnold');
  });

  it('can add new lines in an empty table, save the changes and retrieve them after a page refresh', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE).then((value) => {
      const scenarioId = value.scenarioCreatedId;
      const scenarioUrl = `${BREWERY_WORKSPACE_ID}/scenario/${scenarioId}`;

      ScenarioParameters.expandParametersAccordion();
      BreweryParameters.switchToCustomersTab();
      BreweryParameters.getCustomersTableGrid().should('exist');

      BreweryParameters.addRowCustomersTableData();
      BreweryParameters.getCustomersTableRows().should('have.length', 1);
      BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'value');
      BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 0).should('have.text', 'false');
      BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '');

      ScenarioParameters.save();
      route.browse({ url: scenarioUrl });

      BreweryParameters.switchToCustomersTab();
      BreweryParameters.getCustomersTableRows().should('have.length', 1);
      BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'value');
      BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 0).should('have.text', 'false');
      BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '');
    });
  });

  it('can import a CSV file that has a wrong header and overwrite the header before upload', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.importCustomersTableData(CSV_WRONG_HEADER_FILE_PATH);
    BreweryParameters.getCustomersTableRows().should('have.length', 4);

    cy.intercept('POST', API_REGEX.FILE_UPLOAD).as('fileUploadRequest');
    ScenarioParameters.save();
    // TODO: add support for stubbing of file upload queries
    cy.wait('@fileUploadRequest').then((req) => {
      expect(req.response.statusCode).to.equal(201);
      expect(req.request.body).not.to.contain('wrong_header_line,should_have_6_columns');
      expect(req.request.body).to.contain('name,age,canDrinkAlcohol,favoriteDrink,birthday,height');
    });
  });
});
