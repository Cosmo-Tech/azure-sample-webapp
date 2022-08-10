import utils from '../../commons/TestUtils';
import { Login, ScenarioManager, Scenarios } from '../../commons/actions';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});

describe('Scenario sharing with a link', () => {
  const scenarios = Array(3)
    .fill('Test Cypress - Router - ' + utils.randomStr(7), 0)
    .map((scenarioName, index) => scenarioName + ' - ' + index);
  const scenariosIds = [];
  before(() => {
    Login.login();
    scenarios.map((scenario, index) =>
      Scenarios.createScenario(scenario, true, DATASET.BREWERY_ADT, RUN_TEMPLATE.BREWERY_PARAMETERS).then((data) => {
        scenariosIds[index] = data.scenarioCreatedId;
      })
    );
  });
  after(() => {
    ScenarioManager.deleteScenarioList(scenarios);
  });
  it('shares the scenario with a link', () => {
    cy.visit(`/scenario/${scenariosIds[1]}`);
    cy.url({ timeout: 2000 }).should('include', `/scenario/${scenariosIds[1]}`);
    Scenarios.getScenarioSelectorInput().should('have.value', scenarios[1]);
  });
});
