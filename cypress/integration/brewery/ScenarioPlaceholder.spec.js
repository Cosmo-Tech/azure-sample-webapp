import { ScenarioManager, ScenarioParameters, Scenarios } from '../../commons/actions';
import { Login } from '../../commons/actions/brewery';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import utils from '../../commons/TestUtils';
import { SCENARIO_RUN_IN_PROGRESS } from '../../commons/constants/generic/TestConstants';

describe('checks the placeholder text before and while running', () => {
  const scenario = 'Test Cypress - Placeholder - ' + utils.randomStr(7);

  before(() => {
    Login.login();
  });

  after(() => {
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.deleteScenario(scenario);
  });

  it('checks the placeholder before running, launches scenario and checks the placeholder and launch button', () => {
    Scenarios.createScenario(scenario, true, DATASET.BREWERY_ADT, RUN_TEMPLATE.BREWERY_PARAMETERS);
    Scenarios.getDashboardPlaceholder().should('not.be.visible');
    Scenarios.getDashboardAccordion().click();
    Scenarios.getDashboardPlaceholder().should('be.visible');
    Scenarios.getDashboardPlaceholder().should('have.text', 'The scenario has not been run yet');
    ScenarioParameters.getLaunchButton().click();
    ScenarioParameters.getLaunchConfirmDialog().should('be.visible');
    ScenarioParameters.getLaunchConfirmButton().click();
    Scenarios.getDashboardPlaceholder().should('have.text', SCENARIO_RUN_IN_PROGRESS);
    ScenarioParameters.getLaunchButton().should('be.disabled');
  });
});
