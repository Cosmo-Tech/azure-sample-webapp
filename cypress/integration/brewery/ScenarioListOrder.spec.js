import { Login, ScenarioManager, Scenarios } from '../../commons/actions';
import utils from '../../commons/TestUtils';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';

describe('check scenario sorted list after reload', () => {
  const scenarios = Array(3)
    .fill('A - Test Cypress - ' + utils.randomStr(7), 0)
    .map((scenarioName, index) => scenarioName + index);
  const scenariosIds = [];
  before(() => {
    Login.login();
    scenarios.map((scenario, index) =>
      Scenarios.createScenario(scenario, true, DATASET.BREWERY_ADT, RUN_TEMPLATE.BREWERY_PARAMETERS).then((data) => {
        scenariosIds[index] = data.scenarioCreatedId;
      })
    );
  });

  beforeEach(() => {
    Login.relogin();
  });
  after(() => {
    ScenarioManager.deleteScenarioList(scenarios);
  });
  it('checks first scenario in the list after reload', () => {
    Scenarios.selectScenario(scenarios[1], scenariosIds[1]);
    cy.visit('/scenario');
    Scenarios.getScenarioSelectorInput().should('have.value', scenarios[0]);
  });
});

describe('check the list of sorted scenarios after deleting the current scenario', () => {
  const masterScenarioA = 'AA - master scenario - Test Cypress - ' + utils.randomStr(7);
  const childScenarioA = 'AA - child scenario - Test Cypress - ' + utils.randomStr(7);
  const masterScenarioB = 'BB - master scenario - Test Cypress - ' + utils.randomStr(7);

  before(() => {
    Login.login();
    Scenarios.createScenario(masterScenarioA, true, DATASET.BREWERY_ADT, RUN_TEMPLATE.BREWERY_PARAMETERS);
    Scenarios.createScenario(childScenarioA, false, masterScenarioA, RUN_TEMPLATE.BREWERY_PARAMETERS);
    Scenarios.createScenario(masterScenarioB, true, DATASET.BREWERY_ADT, RUN_TEMPLATE.BREWERY_PARAMETERS);
  });
  beforeEach(() => {
    Login.relogin();
  });
  it('deletes current scenario and checks sorted list', () => {
    Scenarios.getScenarioSelectorInput().should('have.value', masterScenarioA);
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.deleteScenario(masterScenarioA);
    Scenarios.switchToScenarioView();
    Scenarios.getScenarioSelectorInput().should('have.value', childScenarioA);
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.deleteScenario(childScenarioA);
    Scenarios.switchToScenarioView();
    Scenarios.getScenarioSelectorInput().should('have.value', masterScenarioB);
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.deleteScenario(masterScenarioB);
  });
});
