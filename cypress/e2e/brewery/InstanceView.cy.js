// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { InstanceVisualization, Login, Scenarios, ScenarioManager } from '../../commons/actions';
import { Login as BreweryLogin } from '../../commons/actions/brewery';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { stub } from '../../commons/services/stubbing';
import { setup } from '../../commons/utils/setup';

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
  beforeEach(() => {
    BreweryLogin.login();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    ScenarioManager.deleteScenarioList(scenarioNamesToDelete);
  });

  it('can display a scenario created using an ADT dataset', () => {
    const scenarioName = `Test Cypress - Instance view - ADT dataset - ${utils.randomStr(7)}`;
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, DATASET.BREWERY_ADT, RUN_TEMPLATE.WITHOUT_PARAMETERS);
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
