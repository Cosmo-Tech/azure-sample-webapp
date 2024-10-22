// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { ErrorBanner, Login, ScenarioManager, ScenarioParameters, Scenarios, Workspaces } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import {
  BREWERY_WORKSPACE_ID,
  DATASET,
  REAL_BREWERY_WORKSPACE_ID,
  RUN_TEMPLATE,
} from '../../commons/constants/brewery/TestConstants';
import { setup } from '../../commons/utils';

const CSV_VALID_WITH_EMPTY_FIELDS = 'customers_empty_authorized_fields.csv';
const FILE_PATH_1 = 'dummy_dataset_1.csv';

describe('Switching between workspaces and running four scenarios at the same time', () => {
  const randomString = utils.randomStr(7);
  const firstWorkspaceParentScenarioName = 'Parent Scenario First Workspace - ' + randomString;
  const firstWorkspaceChildScenarioName = 'Child Scenario First Workspace - ' + randomString;
  const secondWorkspaceParentScenarioName = 'Parent Scenario Second Workspace - ' + randomString;
  const secondWorkspaceChildScenarioName = 'Child Scenario Second Workspace - ' + randomString;

  before(() => {
    setup.setCypressKeystrokeDelay();
  });

  it('can create, edit, upload files, create children while switching workspaces', () => {
    Login.login();
    Workspaces.getWorkspacesView(10).should('exist');
    Workspaces.selectWorkspace(REAL_BREWERY_WORKSPACE_ID);

    // create first parent scenario, edit and save it
    Scenarios.createScenario(
      firstWorkspaceParentScenarioName,
      true,
      DATASET.BREWERY_STORAGE,
      RUN_TEMPLATE.BREWERY_PARAMETERS
    );
    Scenarios.getScenarioLoadingSpinner(15).should('exist').should('not.be.visible');
    ScenarioParameters.getParametersTabs().should('be.visible');
    BreweryParameters.getStockInput().clear().type('40');
    BreweryParameters.getRestockInput().clear().type('10');
    BreweryParameters.getWaitersInput().clear().type('1');
    ScenarioParameters.save();

    Workspaces.switchToWorkspaceView();
    Workspaces.selectWorkspace(BREWERY_WORKSPACE_ID);

    // create second parent scenario, edit it and save it
    Scenarios.createScenario(
      secondWorkspaceParentScenarioName,
      true,
      DATASET.BREWERY_STORAGE,
      RUN_TEMPLATE.BREWERY_PARAMETERS
    ).then((value) => {
      Scenarios.getScenarioLoadingSpinner(15).should('exist').should('not.be.visible');
      BreweryParameters.getStockInput().clear().type('400');
      BreweryParameters.getRestockInput().clear().type('10');
      BreweryParameters.getWaitersInput().clear().type('15');
      ScenarioParameters.save();
    });

    Workspaces.switchToWorkspaceView();
    Workspaces.selectWorkspace(REAL_BREWERY_WORKSPACE_ID);

    // create first child scenario and edit it
    Scenarios.createScenario(
      firstWorkspaceChildScenarioName,
      false,
      firstWorkspaceParentScenarioName,
      RUN_TEMPLATE.BASIC_TYPES
    );
    Scenarios.getScenarioLoadingSpinner(15).should('exist').should('not.be.visible');
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.importCustomersTableData(CSV_VALID_WITH_EMPTY_FIELDS);
    BreweryParameters.getCustomersTableGrid().should('not.be.empty');
    BreweryParameters.getCustomersTableRows().should('have.length', 8);
    ScenarioParameters.save();
    Workspaces.switchToWorkspaceView();
    Workspaces.selectWorkspace(BREWERY_WORKSPACE_ID);

    // create second child scenario and edit it
    Scenarios.createScenario(
      secondWorkspaceChildScenarioName,
      false,
      secondWorkspaceParentScenarioName,
      RUN_TEMPLATE.BASIC_TYPES
    ).then((value) => {
      const secondWorkspaceChildScenarioId = value.scenarioCreatedId;
      Scenarios.getScenarioLoadingSpinner(15).should('exist').should('not.be.visible');
      BreweryParameters.switchToDatasetPartsTab();
      BreweryParameters.uploadExampleDatasetPart1(FILE_PATH_1);
      ScenarioParameters.save();

      // check scenario can't be found with wrong workspaceId in url
      cy.visit(`${REAL_BREWERY_WORKSPACE_ID}/scenario/${secondWorkspaceChildScenarioId}`);
      ErrorBanner.checkAnDismissErrorBanner();

      // delete all scenarios
      Workspaces.switchToWorkspaceView();
      Workspaces.selectWorkspace(REAL_BREWERY_WORKSPACE_ID);
      ScenarioManager.switchToScenarioManager();
      ScenarioManager.deleteScenario(firstWorkspaceParentScenarioName);
      ScenarioManager.deleteScenario(firstWorkspaceChildScenarioName);
      Workspaces.switchToWorkspaceView();
      Workspaces.selectWorkspace(BREWERY_WORKSPACE_ID);
      ScenarioManager.switchToScenarioManager();
      ScenarioManager.deleteScenario(secondWorkspaceParentScenarioName);
      ScenarioManager.deleteScenario(secondWorkspaceChildScenarioName);
    });
  });
});
