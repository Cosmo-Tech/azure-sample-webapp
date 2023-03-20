import { setup } from '../../commons/utils/setup';
import { stub } from '../../commons/services/stubbing';
import {
  InstanceVisualization,
  Login,
  ScenarioManager,
  Scenarios,
  Workspaces,
  ScenarioSelector,
} from '../../commons/actions';
import { DEFAULT_SCENARIOS_LIST, EXTENDED_WORKSPACES_LIST } from '../../fixtures/stubbing/default';
import { apiUtils as api, routeUtils as route } from '../../commons/utils';

describe('Back and forward navigation between tabs, scenarios and workspaces', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
      GET_WORKSPACES: true,
      GET_SOLUTIONS: true,
    });
    stub.setWorkspaces(EXTENDED_WORKSPACES_LIST);
  });
  beforeEach(() => {
    Login.loginWithoutWorkspace();
  });
  after(() => {
    stub.stop();
  });
  it('checks back and forward navigation inside the web app', () => {
    Workspaces.getWorkspacesView().should('exist');
    Workspaces.selectWorkspace(EXTENDED_WORKSPACES_LIST[2].id);

    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[3].name, DEFAULT_SCENARIOS_LIST[3].id);
    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[2].name, DEFAULT_SCENARIOS_LIST[2].id);
    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[4].name, DEFAULT_SCENARIOS_LIST[4].id);

    route.goBackToScenario(DEFAULT_SCENARIOS_LIST[2].id);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[2].name);

    route.goBackToScenario(DEFAULT_SCENARIOS_LIST[3].id);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);

    Workspaces.getHomeButton().should('be.visible').click();
    Workspaces.getWorkspacesView().should('exist');

    api.interceptNewPageQueries();
    route.goBackToScenario(DEFAULT_SCENARIOS_LIST[3].id);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);

    InstanceVisualization.switchToInstanceVisualization();
    cy.url({ timeout: 3000 }).should('include', `/instance/${DEFAULT_SCENARIOS_LIST[3].id}`);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);

    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[2].name, DEFAULT_SCENARIOS_LIST[2].id);
    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[4].name, DEFAULT_SCENARIOS_LIST[4].id);

    route.goBackToScenario(DEFAULT_SCENARIOS_LIST[2].id, 'instance');
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[2].name);
    route.goBackToScenario(DEFAULT_SCENARIOS_LIST[3].id, 'instance');
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);

    route.goForwardToScenario(DEFAULT_SCENARIOS_LIST[2].id, 'instance');
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[2].name);
    route.goForwardToScenario(DEFAULT_SCENARIOS_LIST[4].id, 'instance');
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[4].name);

    route.goBackToScenario(DEFAULT_SCENARIOS_LIST[2].id, 'instance');
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[2].name);
    route.goBackToScenario(DEFAULT_SCENARIOS_LIST[3].id, 'instance');
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);

    route.goBackToScenario(DEFAULT_SCENARIOS_LIST[3].id);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);
    route.goBackToScenario(DEFAULT_SCENARIOS_LIST[0].id);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);

    cy.go('back');
    Workspaces.getWorkspacesView().should('exist');

    api.interceptNewPageQueries();
    route.goForwardToScenario(DEFAULT_SCENARIOS_LIST[0].id);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);
    route.goForwardToScenario(DEFAULT_SCENARIOS_LIST[3].id);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);
    route.goForwardToScenario(DEFAULT_SCENARIOS_LIST[3].id, 'instance');
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);

    ScenarioManager.switchToScenarioManager();
    ScenarioManager.openScenarioFromScenarioManager(DEFAULT_SCENARIOS_LIST[2].id);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[2].name);
    cy.go('back');
    ScenarioManager.getScenarioManagerView().should('be.visible');
    route.goForwardToScenario(DEFAULT_SCENARIOS_LIST[2].id);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[2].name);
    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[3].name, DEFAULT_SCENARIOS_LIST[3].id);
    route.goBackToScenario(DEFAULT_SCENARIOS_LIST[2].id);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[2].name);
    cy.go('back');
    ScenarioManager.getScenarioManagerView().should('be.visible');

    Workspaces.getHomeButton().should('be.visible').click();
    Workspaces.getWorkspacesView().should('exist');
    api.interceptNewPageQueries();
    Workspaces.selectWorkspace(EXTENDED_WORKSPACES_LIST[1].id);
    Scenarios.getScenarioViewTab(60).should('be.visible');

    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[4].name, DEFAULT_SCENARIOS_LIST[4].id);
    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[2].name, DEFAULT_SCENARIOS_LIST[2].id);

    Workspaces.getHomeButton().should('be.visible').click();
    Workspaces.getWorkspacesView().should('exist');
    api.interceptNewPageQueries();
    Workspaces.selectWorkspace(EXTENDED_WORKSPACES_LIST[2].id);
    Scenarios.getScenarioViewTab(60).should('be.visible');

    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[1].name, DEFAULT_SCENARIOS_LIST[1].id);
    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[3].name, DEFAULT_SCENARIOS_LIST[3].id);
    route.goBackToScenario(DEFAULT_SCENARIOS_LIST[1].id);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[1].name);
    route.goBackToScenario(DEFAULT_SCENARIOS_LIST[0].id);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);
    cy.go('back');
    Workspaces.getWorkspacesView().should('exist');

    api.interceptNewPageQueries();
    route.goBackToScenario(DEFAULT_SCENARIOS_LIST[2].id);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[2].name);
    route.goBackToScenario(DEFAULT_SCENARIOS_LIST[4].id);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[4].name);
    route.goBackToScenario(DEFAULT_SCENARIOS_LIST[0].id);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);
    cy.go('back');
    Workspaces.getWorkspacesView().should('exist');
  });
});
