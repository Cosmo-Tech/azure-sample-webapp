import { Login, Scenarios } from '../../commons/actions';
import { setup } from '../../commons/utils/setup';
import { stub } from '../../commons/services/stubbing';
import { DEFAULT_SCENARIOS_LIST } from '../../fixtures/stubbing/default';
import { apiUtils as api, routeUtils as route } from '../../commons/utils';

describe('Scenario sharing with a link', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
    });
    Login.login();
  });
  beforeEach(() => {
    Login.relogin();
  });

  after(() => {
    stub.stop();
  });
  it('shares the scenario with a link', () => {
    const reqGetDatasetsAlias = api.interceptGetDatasets();
    Scenarios.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);
    route.browse(`/scenario/${DEFAULT_SCENARIOS_LIST[3].id}`);
    api.waitAlias(reqGetDatasetsAlias);
    cy.url({ timeout: 5000 }).should('include', `/scenario/${DEFAULT_SCENARIOS_LIST[3].id}`);
    Scenarios.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);
  });
});
