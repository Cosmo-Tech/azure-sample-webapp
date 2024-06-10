// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { InstanceVisualization, Login } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { setup } from '../../commons/utils';
import { SCENARIO_WITH_TWINGRAPH_DATASET } from '../../fixtures/stubbing/InstanceVisualization/scenarios';
import { TWINGRAPH_QUERIES_RESPONSES } from '../../fixtures/stubbing/InstanceVisualization/twingraphQueriesResponses';
import { DEFAULT_DATASET, WORKSPACE_WITH_INSTANCE_VIEW } from '../../fixtures/stubbing/default';

describe('Instance view disabled', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start();
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('does not show the instance view tab if config is invalid', () => {
    InstanceVisualization.getInstanceVisualizationViewTab().should('not.exist');
  });
});

describe('Instance view when enabled', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start();
    stub.setWorkspaces([WORKSPACE_WITH_INSTANCE_VIEW]);
    stub.setDatasets([DEFAULT_DATASET]);
    stub.setScenarios([SCENARIO_WITH_TWINGRAPH_DATASET]);
  });
  after(() => {
    stub.stop();
  });
  beforeEach(() => {
    Login.login();
  });
  it('can display a scenario created using an ADT dataset', () => {
    InstanceVisualization.interceptTwingraphQueries(TWINGRAPH_QUERIES_RESPONSES);
    InstanceVisualization.switchToInstanceVisualization();
    InstanceVisualization.getLoadingSpinnerContainer().should('be.visible');
    InstanceVisualization.getLoadingSpinnerContainer(30).should('not.exist'); // 30 seconds timeout
    InstanceVisualization.getPlaceholder().should('not.exist');
    InstanceVisualization.getCytoscapeScene().should('be.visible');
    InstanceVisualization.getDrawer().should('not.exist');
    InstanceVisualization.openDrawer();
    InstanceVisualization.getDrawer().should('be.visible');
    InstanceVisualization.switchToDrawerSettingsTab();
    InstanceVisualization.switchToDrawerDetailsTab();
    InstanceVisualization.closeDrawer();
    InstanceVisualization.getDrawer().should('not.exist');
  });

  // TODO: Add test when Azure Storage instances are better supported. This type of instance currently causes an error
  // of the Function App, and thus can't be tested yet (the webapp does not crash but a placeholder and an error banner
  // are displayed)
});
