import { Login, Scenarios } from '../../commons/actions';
import { setup } from '../../commons/utils/setup';
import { stub } from '../../commons/services/stubbing';
import { DEFAULT_SCENARIOS_LIST } from '../../fixtures/stubbing/default';
import { routeUtils as route } from '../../commons/utils';

describe('Scenario sharing with a link', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
      GET_WORKSPACES: true,
      GET_SOLUTIONS: true,
    });
    Login.login();
  });

  beforeEach(() => {
    Login.relogin();
  });

  after(() => {
    stub.stop();
  });

  it('shares the scenario with a link to Scenario view', () => {
    Scenarios.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);
    route.browse(`W-stbbdbrwry/scenario/${DEFAULT_SCENARIOS_LIST[3].id}`);
    Scenarios.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);
  });

  it('shares the scenario with a link to Instance view', () => {
    Scenarios.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);
    route.browse(`W-stbbdbrwry/instance/${DEFAULT_SCENARIOS_LIST[3].id}`);
    Scenarios.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);
  });
});
