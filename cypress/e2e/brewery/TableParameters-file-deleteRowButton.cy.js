// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { BreweryParameters, Login } from '../../commons/actions/brewery';
import { ScenarioParameters, ScenarioManager, Scenarios, ScenarioSelector } from '../../commons/actions/generic';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';

const SCENARIO_DATASET = DATASET.BREWERY_ADT;
const SCENARIO_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;

function forgeScenarioName() {
  const prefix = 'Scenario - ';
  const randomString = utils.randomStr(7);
  return prefix + randomString;
}

const scenarioName = forgeScenarioName();
let scenarioId;
const scenarioNamesToDelete = [];
scenarioNamesToDelete.push(scenarioName);

describe('Table edit delete row button behavior', () => {
  before(() => {
    Login.login();
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE).then((data) => {
      scenarioId = data.scenarioCreatedId;
    });
  });

  after(() => {
    ScenarioManager.deleteScenarioList(scenarioNamesToDelete);
  });

  it('Can edit/load/discard/save table parameter and check that delete row button has correct behavior', () => {
    ScenarioSelector.selectScenario(scenarioName, scenarioId);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersDeleteRowButton().should('have.attr', 'aria-disabled');
    BreweryParameters.importCustomersTableData('customers.csv');
    BreweryParameters.getCustomersDeleteRowButton().should('have.attr', 'aria-disabled');
    BreweryParameters.addRowCustomersTableData();
    BreweryParameters.getCustomersDeleteRowButton().should('have.attr', 'aria-disabled');
    BreweryParameters.getCustomersTableCell('name', 0).click();
    BreweryParameters.getCustomersDeleteRowButton().should('not.have.attr', 'aria-disabled');
    BreweryParameters.deleteRowsCustomersTableData();
    BreweryParameters.getCustomersDeleteRowButton().should('have.attr', 'aria-disabled');
    BreweryParameters.switchToEventsTab();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersDeleteRowButton().should('have.attr', 'aria-disabled');
    BreweryParameters.editCustomersTableStringCell('age', 0, '72').should('have.text', '72');
    BreweryParameters.getCustomersDeleteRowButton().should('not.have.attr', 'aria-disabled');
    ScenarioParameters.save();
    BreweryParameters.getCustomersDeleteRowButton().should('have.attr', 'aria-disabled');
    BreweryParameters.editCustomersTableStringCell('age', 0, '13').should('have.text', '13');
    BreweryParameters.getCustomersDeleteRowButton().should('not.have.attr', 'aria-disabled');
    ScenarioParameters.discard();
    BreweryParameters.getCustomersDeleteRowButton().should('have.attr', 'aria-disabled');
  });
});
