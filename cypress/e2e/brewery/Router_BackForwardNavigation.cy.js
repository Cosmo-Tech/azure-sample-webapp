// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import {
  InstanceVisualization,
  Login,
  ScenarioManager,
  Scenarios,
  Workspaces,
  ScenarioSelector,
  DatasetManager,
} from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { routeUtils as route } from '../../commons/utils';
import { DEFAULT_SCENARIOS_LIST, EXTENDED_WORKSPACES_LIST } from '../../fixtures/stubbing/default';

// Patch EXTENDED_WORKSPACES_LIST to enable datasetmanager
EXTENDED_WORKSPACES_LIST.forEach((workspace) => (workspace.webApp.options.datasetManager = {}));

describe('Back and forward navigation between tabs, scenarios and workspaces', () => {
  before(() => {
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
      GET_WORKSPACES: true,
      GET_SOLUTIONS: true,
      GET_ORGANIZATION: true,
      PERMISSIONS_MAPPING: true,
    });
    stub.setWorkspaces(EXTENDED_WORKSPACES_LIST);
  });

  beforeEach(() => {
    Login.login();
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

    route.goBack({ scenarioId: DEFAULT_SCENARIOS_LIST[2].id });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[2].name);

    route.goBack({ scenarioId: DEFAULT_SCENARIOS_LIST[3].id });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);

    Workspaces.switchToWorkspaceView();
    Workspaces.getWorkspacesView().should('exist');

    route.goBack({ workspaceId: EXTENDED_WORKSPACES_LIST[2].id, scenarioId: DEFAULT_SCENARIOS_LIST[3].id });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);

    InstanceVisualization.switchToInstanceVisualization();
    cy.url({ timeout: 3000 }).should('include', `/instance/${DEFAULT_SCENARIOS_LIST[3].id}`);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);

    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[2].name, DEFAULT_SCENARIOS_LIST[2].id);
    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[4].name, DEFAULT_SCENARIOS_LIST[4].id);

    route.goBack({ scenarioId: DEFAULT_SCENARIOS_LIST[2].id, expectedURL: 'instance' });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[2].name);
    route.goBack({ scenarioId: DEFAULT_SCENARIOS_LIST[3].id, expectedURL: 'instance' });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);

    route.goForward({ scenarioId: DEFAULT_SCENARIOS_LIST[2].id, expectedURL: 'instance' });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[2].name);
    route.goForward({ scenarioId: DEFAULT_SCENARIOS_LIST[4].id, expectedURL: 'instance' });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[4].name);

    route.goBack({ scenarioId: DEFAULT_SCENARIOS_LIST[2].id, expectedURL: 'instance' });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[2].name);
    route.goBack({ scenarioId: DEFAULT_SCENARIOS_LIST[3].id, expectedURL: 'instance' });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);

    route.goBack({ expectedURL: 'scenario' });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);
    route.goBack({ scenarioId: DEFAULT_SCENARIOS_LIST[0].id });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);

    route.goBack();
    Workspaces.getWorkspacesView().should('exist');
    route.goForward({ workspaceId: EXTENDED_WORKSPACES_LIST[2].id, expectedURL: 'scenario' });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);
    route.goForward({ scenarioId: DEFAULT_SCENARIOS_LIST[3].id, expectedURL: 'scenario' });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);
    route.goForward({ expectedURL: 'instance' });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);

    ScenarioManager.switchToScenarioManager();
    ScenarioManager.openScenarioFromScenarioManager(DEFAULT_SCENARIOS_LIST[2].id);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[2].name);
    route.goBack();
    ScenarioManager.getScenarioManagerView().should('be.visible');
    route.goForward({ expectedURL: 'scenario' });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[2].name);
    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[3].name, DEFAULT_SCENARIOS_LIST[3].id);
    route.goBack({ scenarioId: DEFAULT_SCENARIOS_LIST[2].id });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[2].name);
    route.goBack();
    ScenarioManager.getScenarioManagerView().should('be.visible');

    Workspaces.switchToWorkspaceView();
    Workspaces.getWorkspacesView().should('exist');
    Workspaces.selectWorkspace(EXTENDED_WORKSPACES_LIST[1].id);
    Scenarios.getScenarioViewTab(60).should('be.visible');

    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[4].name, DEFAULT_SCENARIOS_LIST[4].id);
    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[2].name, DEFAULT_SCENARIOS_LIST[2].id);

    Workspaces.switchToWorkspaceView();
    Workspaces.getWorkspacesView().should('exist');
    Workspaces.selectWorkspace(EXTENDED_WORKSPACES_LIST[2].id);
    Scenarios.getScenarioViewTab(60).should('be.visible');

    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[1].name, DEFAULT_SCENARIOS_LIST[1].id);
    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[3].name, DEFAULT_SCENARIOS_LIST[3].id);
    route.goBack({ scenarioId: DEFAULT_SCENARIOS_LIST[1].id });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[1].name);
    route.goBack({ scenarioId: DEFAULT_SCENARIOS_LIST[0].id });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);
    route.goBack();
    Workspaces.getWorkspacesView().should('exist');

    route.goBack({ workspaceId: EXTENDED_WORKSPACES_LIST[1].id, scenarioId: DEFAULT_SCENARIOS_LIST[2].id });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[2].name);
    route.goBack({ scenarioId: DEFAULT_SCENARIOS_LIST[4].id });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[4].name);
    route.goBack({ scenarioId: DEFAULT_SCENARIOS_LIST[0].id });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);
    route.goBack();
    Workspaces.getWorkspacesView().should('exist');
    Workspaces.selectWorkspace(EXTENDED_WORKSPACES_LIST[2].id);
    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[3].name, DEFAULT_SCENARIOS_LIST[3].id);
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.getNoDatasetsPlaceholder().should('be.visible');
    route.goBack();
    route.goForward();
    DatasetManager.getNoDatasetsPlaceholder().should('be.visible');
    Workspaces.switchToWorkspaceView();
    route.goBack({ workspaceId: EXTENDED_WORKSPACES_LIST[2].id });
    DatasetManager.getNoDatasetsPlaceholder(15).should('be.visible');
  });
});
