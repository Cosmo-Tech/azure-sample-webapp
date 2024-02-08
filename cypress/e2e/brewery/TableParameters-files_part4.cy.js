// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { Downloads, Scenarios, ScenarioManager, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters, Login } from '../../commons/actions/brewery';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import {
  EXPECTED_CUSTOMERS_AFTER_XLSX_IMPORT,
  EXPECTED_EVENTS_AFTER_XLSX_IMPORT,
} from '../../fixtures/TableParametersData';

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});

const SCENARIO_DATASET = DATASET.BREWERY_ADT;
const SCENARIO_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;
const CUSTOMERS_FILE_PATH = 'customers.xlsx';
const EVENTS_FILE_PATH = 'events.xlsx';

function forgeScenarioName() {
  const prefix = 'Scenario with table - ';
  return prefix + utils.randomStr(7);
}

describe('Table parameters files standard operations part 4', () => {
  beforeEach(() => {
    Login.login();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    Downloads.clearDownloadsFolder();
    // Delete all tests scenarios
    ScenarioManager.switchToScenarioManager();
    for (const scenarioName of scenarioNamesToDelete) {
      ScenarioManager.deleteScenario(scenarioName);
    }
  });

  it('can create a scenario with default table parameter, edit it, save, re-edit, re-save', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);

    BreweryParameters.switchToEventsTab();
    BreweryParameters.getEventsTableRows().should('have.length', 5);
    BreweryParameters.getEventsTableCell('theme', 0).should('have.text', 'complex systems');
    BreweryParameters.getEventsTableCell('date', 1).should('have.text', '02/10/2024');
    BreweryParameters.getEventsTableCell('timeOfDay', 2).should('have.text', 'evening');
    BreweryParameters.getEventsTableCell('reservationsNumber', 3).should('have.text', '220');
    BreweryParameters.getEventsTableCell('online', 4).should('have.text', 'false');

    ScenarioParameters.getSaveButton().should('not.exist');
    ScenarioParameters.getParametersDiscardButton().should('not.exist');
    BreweryParameters.editEventsTableStringCell('reservationsNumber', 3, '77').should('have.text', '77');
    ScenarioParameters.getParametersDiscardButton().should('be.visible');
    ScenarioParameters.getSaveButton().should('be.visible');
    ScenarioParameters.save();
    BreweryParameters.getEventsTableCell('reservationsNumber', 3).should('have.text', '77');
    ScenarioParameters.getParametersDiscardButton().should('not.exist');
    ScenarioParameters.getSaveButton().should('not.exist');
    BreweryParameters.editEventsTableStringCell('reservationsNumber', 3, '19').should('have.text', '19');
    ScenarioParameters.save();
  });

  it('can import two xlsx files, edit, upload, save and export', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.importCustomersTableData(CUSTOMERS_FILE_PATH);

    BreweryParameters.switchToEventsTab();
    BreweryParameters.getEventsTableCell('theme', 0).should('have.text', 'complex systems');
    BreweryParameters.importEventsTableData(EVENTS_FILE_PATH);

    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableRows().should('have.length', 5);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Bob');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 1).should('have.text', 'false');

    BreweryParameters.switchToEventsTab();
    BreweryParameters.getEventsTableRows().should('have.length', 5);
    BreweryParameters.getEventsTableCell('theme', 0).should('have.text', 'digital twin');
    BreweryParameters.getEventsTableCell('date', 1).should('have.text', '15/07/2022');

    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '10');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 2).should('have.text', 'Wine');
    BreweryParameters.getCustomersTableCell('birthday', 3).should('have.text', '12/05/1987');
    BreweryParameters.getCustomersTableCell('height', 3).should('have.text', '1.83');
    BreweryParameters.editCustomersTableStringCell('name', 0, 'Bill').should('have.text', 'Bill');

    BreweryParameters.switchToEventsTab();
    BreweryParameters.getEventsTableCell('timeOfDay', 2).should('have.text', 'afternoon');
    BreweryParameters.getEventsTableCell('eventType', 3).should('have.text', 'conference');
    BreweryParameters.getEventsTableCell('reservationsNumber', 4).should('have.text', '150');
    BreweryParameters.getEventsTableCell('online', 4).should('have.text', 'true');
    BreweryParameters.editEventsTableStringCell('eventType', 3, 'seminar').should('have.text', 'conference'); // N.E
    BreweryParameters.clearEventsTableStringCell('eventType', 3, false).should('have.text', 'conference'); // N.E
    BreweryParameters.clearEventsTableStringCell('eventType', 3, true).should('have.text', 'conference'); // N.E

    BreweryParameters.switchToCustomersTab();
    BreweryParameters.editCustomersTableStringCell('age', 0, '11').should('have.text', '11');
    BreweryParameters.editCustomersTableStringCell('canDrinkAlcohol', 1, 'true').should('have.text', 'true');
    BreweryParameters.editCustomersTableStringCell('favoriteDrink', 2, 'Beer').should('have.text', 'Beer');

    BreweryParameters.switchToEventsTab();
    BreweryParameters.editEventsTableStringCell('theme', 0, 'complex systems').should('have.text', 'complex systems');
    BreweryParameters.editEventsTableStringCell('date', 1, '654654').should('have.text', '15/07/2022');
    BreweryParameters.editEventsTableStringCell('date', 1, 'dfgoixcù$=)ç').should('have.text', '15/07/2022');
    BreweryParameters.editEventsTableStringCell('date', 1, '12/11/3022').should('have.text', '31/12/2999');
    BreweryParameters.editEventsTableStringCell('date', 1, '09/05/1832').should('have.text', '01/01/1900');
    BreweryParameters.editEventsTableStringCell('date', 1, '02/10/2024').should('have.text', '02/10/2024');
    BreweryParameters.editEventsTableStringCell('timeOfDay', 2, 'night').should('have.text', 'afternoon');
    BreweryParameters.editEventsTableStringCell('timeOfDay', 2, 'midnight').should('have.text', 'afternoon');
    BreweryParameters.editEventsTableStringCell('timeOfDay', 2, 'evening').should('have.text', 'evening');

    BreweryParameters.switchToCustomersTab();
    BreweryParameters.editCustomersTableStringCell('birthday', 3, '01/01/1991').should('have.text', '01/01/1991');
    BreweryParameters.editCustomersTableStringCell('height', 3, '2.01').should('have.text', '2.01');

    BreweryParameters.switchToEventsTab();
    BreweryParameters.editEventsTableStringCell('reservationsNumber', 3, '350').should('have.text', '300');
    BreweryParameters.clearEventsTableStringCell('reservationsNumber', 3).should('have.text', '');
    BreweryParameters.editEventsTableStringCell('reservationsNumber', 3, '-20').should('have.text', '0');
    BreweryParameters.editEventsTableStringCell('reservationsNumber', 3, '220').should('have.text', '220');
    BreweryParameters.editEventsTableStringCell('online', 4, 'false').should('have.text', 'false');

    BreweryParameters.switchToCustomersTab();
    BreweryParameters.exportCustomersTableDataToCSV();
    Downloads.checkByContent('customers.csv', EXPECTED_CUSTOMERS_AFTER_XLSX_IMPORT);

    BreweryParameters.switchToEventsTab();
    BreweryParameters.exportEventsTableDataToCSV();
    Downloads.checkByContent('events.csv', EXPECTED_EVENTS_AFTER_XLSX_IMPORT);

    ScenarioParameters.save();
    // Check that cells values have been saved
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Bill');
    BreweryParameters.getCustomersTableCell('age', 0).should('have.text', '11');
    BreweryParameters.getCustomersTableCell('canDrinkAlcohol', 1).should('have.text', 'true');
    BreweryParameters.getCustomersTableCell('favoriteDrink', 2).should('have.text', 'Beer');
    BreweryParameters.getCustomersTableCell('birthday', 3).should('have.text', '01/01/1991');
    BreweryParameters.getCustomersTableCell('height', 3).should('have.text', '2.01');

    BreweryParameters.switchToEventsTab();
    BreweryParameters.getEventsTableRows().should('have.length', 5);

    BreweryParameters.getEventsTableCell('theme', 0).should('have.text', 'complex systems');
    BreweryParameters.getEventsTableCell('date', 1).should('have.text', '02/10/2024');
    BreweryParameters.getEventsTableCell('timeOfDay', 2).should('have.text', 'evening');
    BreweryParameters.getEventsTableCell('reservationsNumber', 3).should('have.text', '220');
    BreweryParameters.getEventsTableCell('online', 4).should('have.text', 'false');
  });
});
