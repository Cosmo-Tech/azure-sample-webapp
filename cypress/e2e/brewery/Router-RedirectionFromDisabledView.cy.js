// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DatasetManager, InstanceVisualization, Login } from '../../commons/actions';
import { getDashboardsTab } from '../../commons/actions/generic/Dashboards';
import { stub } from '../../commons/services/stubbing';
import { routeUtils as route } from '../../commons/utils';
import {
  WORKSPACE_LIST_WITHOUT_DASHBOARDS,
  WORKSPACE_WITHOUT_DASHBOARDS,
} from '../../fixtures/stubbing/ScenarioViewDashboard/workspace';
import { DEFAULT_SCENARIOS_LIST } from '../../fixtures/stubbing/default';

const scenarioId = DEFAULT_SCENARIOS_LIST[0].id;

describe('redirection from disabled view', () => {
  before(() => {
    stub.start();
    stub.setWorkspaces(WORKSPACE_LIST_WITHOUT_DASHBOARDS);
  });

  beforeEach(() => {
    Login.login({
      url: `/${WORKSPACE_WITHOUT_DASHBOARDS.id}`,
      workspaceId: WORKSPACE_WITHOUT_DASHBOARDS.id,
      isPowerBiEnabled: false,
    });
  });

  after(() => {
    stub.stop();
  });
  it('can redirect from disabled Instance view to scenario view', () => {
    route.browse({
      url: `/${WORKSPACE_WITHOUT_DASHBOARDS.id}/instance`,
      workspaceId: WORKSPACE_WITHOUT_DASHBOARDS.id,
      isPowerBiEnabled: false,
      expectedURL: `${WORKSPACE_WITHOUT_DASHBOARDS.id}/scenario/${scenarioId}`,
    });
    InstanceVisualization.getInstanceVisualizationViewTab().should('not.exist');
  });
  it('can redirect from disabled Dataset manager view to scenario view', () => {
    route.browse({
      url: `/${WORKSPACE_WITHOUT_DASHBOARDS.id}/datasetmanager`,
      workspaceId: WORKSPACE_WITHOUT_DASHBOARDS.id,
      isPowerBiEnabled: false,
      expectedURL: `${WORKSPACE_WITHOUT_DASHBOARDS.id}/scenario/${scenarioId}`,
    });
    DatasetManager.getDatasetManagerTab().should('not.exist');
  });
  it('can redirect from dashboards to Scenario view when results display is disabled', () => {
    route.browse({
      url: `${WORKSPACE_WITHOUT_DASHBOARDS.id}/dashboards`,
      workspaceId: WORKSPACE_WITHOUT_DASHBOARDS.id,
      expectedURL: `${WORKSPACE_WITHOUT_DASHBOARDS.id}/scenario/${scenarioId}`,
      isPowerBiEnabled: false,
    });
    getDashboardsTab().should('not.exist');
  });
});
