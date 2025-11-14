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

const WORKSPACE = EXTENDED_WORKSPACES_LIST[2];
const SCENARIO3 = DEFAULT_SCENARIOS_LIST[2];
const SCENARIO4 = DEFAULT_SCENARIOS_LIST[3];
const SCENARIO5 = DEFAULT_SCENARIOS_LIST[4];

// Patch EXTENDED_WORKSPACES_LIST to enable datasetmanager
EXTENDED_WORKSPACES_LIST.forEach((workspace) => (workspace.additionalData.webapp.datasetManager = {}));

const selectScenarioAndWaitForScenarioViewUrlUpdate = (scenario) => {
  ScenarioSelector.selectScenario(scenario.name, scenario.id);
  cy.url({ timeout: 3000 }).should('include', `/scenario/${scenario.id}`);
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(100); // Work-around for electron browser
};

const selectScenarioAndWaitForInstanceViewUrlUpdate = (scenario) => {
  ScenarioSelector.selectScenario(scenario.name, scenario.id);
  cy.url({ timeout: 3000 }).should('include', `/instance/${scenario.id}`);
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(100); // Work-around for electron browser
};

describe('Back and forward navigation between tabs, scenarios and workspaces', () => {
  before(() => {
    stub.start();
    stub.setWorkspaces(EXTENDED_WORKSPACES_LIST);
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('can browse back and forward between scenarios in the scenario view', () => {
    Workspaces.getWorkspacesView().should('exist');
    Workspaces.selectWorkspace(WORKSPACE.id);
    Scenarios.getScenarioViewTab(60).should('be.visible');

    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIO3);
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIO4);
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIO5);

    route.goBack({ scenarioId: SCENARIO4.id });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO4.name);
    route.goBack({ scenarioId: SCENARIO3.id });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO3.name);

    route.goForward({ scenarioId: SCENARIO4.id, expectedURL: `scenario/${SCENARIO4.id}` });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO4.name);
    route.goForward({ scenarioId: SCENARIO5.id, expectedURL: `scenario/${SCENARIO5.id}` });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO5.name);
  });

  it('can browse back and forward to the workspace selector', () => {
    Workspaces.getWorkspacesView().should('exist');
    Workspaces.selectWorkspace(WORKSPACE.id);
    Scenarios.getScenarioViewTab(60).should('be.visible');

    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIO3);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO3.name);

    Workspaces.switchToWorkspaceView();
    Workspaces.getWorkspacesView().should('exist');

    route.goBack({ workspaceId: WORKSPACE.id, scenarioId: SCENARIO3.id });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO3.name);

    route.goForward();
    Workspaces.getWorkspacesView().should('exist');
  });

  it('can browse back and forward to the instance view', () => {
    Workspaces.getWorkspacesView().should('exist');
    Workspaces.selectWorkspace(WORKSPACE.id);
    Scenarios.getScenarioViewTab(60).should('be.visible');

    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIO3);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO3.name);

    InstanceVisualization.switchToInstanceVisualization();
    cy.url({ timeout: 3000 }).should('include', `/instance/${SCENARIO3.id}`);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO3.name);

    selectScenarioAndWaitForInstanceViewUrlUpdate(SCENARIO4);
    selectScenarioAndWaitForInstanceViewUrlUpdate(SCENARIO5);

    route.goBack({ scenarioId: SCENARIO4.id, expectedURL: `instance/${SCENARIO4.id}` });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO4.name);
    route.goBack({ scenarioId: SCENARIO3.id, expectedURL: `instance/${SCENARIO3.id}` });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO3.name);

    route.goForward({ scenarioId: SCENARIO4.id, expectedURL: `instance/${SCENARIO4.id}` });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO4.name);
    route.goForward({ scenarioId: SCENARIO5.id, expectedURL: `instance/${SCENARIO5.id}` });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO5.name);

    // Once again for good measure
    route.goBack({ scenarioId: SCENARIO4.id, expectedURL: `instance/${SCENARIO4.id}` });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO4.name);

    route.goForward({ scenarioId: SCENARIO5.id, expectedURL: `instance/${SCENARIO5.id}` });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO5.name);
  });

  it('can browse back and forward to the scenario manager', () => {
    Workspaces.getWorkspacesView().should('exist');
    Workspaces.selectWorkspace(WORKSPACE.id);
    Scenarios.getScenarioViewTab(60).should('be.visible');

    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIO3);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO3.name);

    ScenarioManager.switchToScenarioManager();
    ScenarioManager.openScenarioFromScenarioManager(SCENARIO4.id);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO4.name);
    route.goBack();
    ScenarioManager.getScenarioManagerView().should('be.visible');
    route.goForward({ expectedURL: `scenario/${SCENARIO4.id}` });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO4.name);
  });

  it('can browse back and forward to the dataset manager', () => {
    Workspaces.getWorkspacesView().should('exist');
    Workspaces.selectWorkspace(WORKSPACE.id);

    Scenarios.getScenarioViewTab(60).should('be.visible');
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIO3);

    DatasetManager.switchToDatasetManagerView();
    DatasetManager.getNoDatasetsPlaceholder().should('be.visible');

    route.goBack();
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO3.name);

    route.goForward();
    DatasetManager.getNoDatasetsPlaceholder().should('be.visible');

    Workspaces.switchToWorkspaceView();
    route.goBack({ workspaceId: WORKSPACE.id });
    DatasetManager.getNoDatasetsPlaceholder(15).should('be.visible');
  });
});
