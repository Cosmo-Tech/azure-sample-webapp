// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import {
  ErrorBanner,
  Login,
  ScenarioManager,
  ScenarioParameters,
  Scenarios,
  Workspaces,
  ScenarioSelector,
} from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import {
  BREWERY_WORKSPACE_ID,
  DATASET,
  REAL_BREWERY_WORKSPACE_ID,
  RUN_TEMPLATE,
} from '../../commons/constants/brewery/TestConstants';
import { setup, routeUtils as route } from '../../commons/utils';

const CSV_VALID_WITH_EMPTY_FIELDS = 'customers_empty_authorized_fields.csv';
const FILE_PATH_1 = 'dummy_dataset_1.csv';

describe('Switching between workspaces and running four scenarios at the same time', () => {
  const randomString = utils.randomStr(7);
  const firstWorkspaceParentScenarioName = 'Parent Scenario First Workspace - ' + randomString;
  const firstWorkspaceChildScenarioName = 'Child Scenario First Workspace - ' + randomString;
  const secondWorkspaceParentScenarioName = 'Parent Scenario Second Workspace - ' + randomString;
  const secondWorkspaceChildScenarioName = 'Child Scenario Second Workspace - ' + randomString;
  const sharedNameScenario = 'Shared Name Scenario - ' + randomString;
  const newSharedNameScenario = 'New Shared Name Scenario - ' + randomString;
  let firstWorkspaceParentScenarioId,
    secondWorkspaceParentScenarioId,
    firstWorkspaceChildScenarioId,
    secondWorkspaceChildScenarioId,
    firstWorkspaceSharedScenarioId,
    secondWorkspaceSharedScenarioId;

  before(() => {
    setup.setCypressKeystrokeDelay();
  });

  it('can create, edit, upload files, create children and run four scenarios at the same time', () => {
    Login.login();
    Workspaces.getWorkspacesView(10).should('exist');
    Workspaces.selectWorkspace(REAL_BREWERY_WORKSPACE_ID);

    // create first parent scenario, edit and save it
    Scenarios.createScenario(
      firstWorkspaceParentScenarioName,
      true,
      DATASET.BREWERY_ADT,
      RUN_TEMPLATE.BREWERY_PARAMETERS
    ).then((value) => {
      firstWorkspaceParentScenarioId = value.scenarioCreatedId;
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
        DATASET.BREWERY_ADT,
        RUN_TEMPLATE.BREWERY_PARAMETERS
      ).then((value) => {
        secondWorkspaceParentScenarioId = value.scenarioCreatedId;
        Scenarios.getScenarioLoadingSpinner(15).should('exist').should('not.be.visible');
        BreweryParameters.getStockInput().clear().type('400');
        BreweryParameters.getRestockInput().clear().type('10');
        BreweryParameters.getWaitersInput().clear().type('15');
        ScenarioParameters.save();

        Workspaces.switchToWorkspaceView();
        Workspaces.selectWorkspace(REAL_BREWERY_WORKSPACE_ID);

        // create first child scenario, edit and launch it
        Scenarios.createScenario(
          firstWorkspaceChildScenarioName,
          false,
          firstWorkspaceParentScenarioName,
          RUN_TEMPLATE.BASIC_TYPES
        ).then((value) => {
          firstWorkspaceChildScenarioId = value.scenarioCreatedId;
          Scenarios.getScenarioLoadingSpinner(15).should('exist').should('not.be.visible');
          BreweryParameters.switchToCustomersTab();
          BreweryParameters.importCustomersTableData(CSV_VALID_WITH_EMPTY_FIELDS);
          BreweryParameters.getCustomersTableGrid().should('not.be.empty');
          ScenarioParameters.launch();
          Workspaces.switchToWorkspaceView();
          Workspaces.selectWorkspace(BREWERY_WORKSPACE_ID);

          // create second child scenario, edit and launch it
          Scenarios.createScenario(
            secondWorkspaceChildScenarioName,
            false,
            secondWorkspaceParentScenarioName,
            RUN_TEMPLATE.BASIC_TYPES
          ).then((value) => {
            secondWorkspaceChildScenarioId = value.scenarioCreatedId;
            Scenarios.getScenarioLoadingSpinner(15).should('exist').should('not.be.visible');
            BreweryParameters.switchToDatasetPartsTab();
            BreweryParameters.uploadExampleDatasetPart1(FILE_PATH_1);
            ScenarioParameters.launch();

            // check the first child scenario is running with right parameters
            route.browse({ url: `${REAL_BREWERY_WORKSPACE_ID}/scenario/${firstWorkspaceChildScenarioId}` });
            Scenarios.getDashboardAccordion().click();
            Scenarios.getDashboardAccordion().click();
            Scenarios.getDashboardPlaceholder().should('be.visible');
            ScenarioParameters.getLaunchButton().should('not.exist');
            ScenarioParameters.getStopScenarioRunButton().should('exist');
            BreweryParameters.switchToCustomersTab();
            BreweryParameters.getCustomersTableGrid().should('not.be.empty');

            // launch first parent scenario
            ScenarioSelector.selectScenario(firstWorkspaceParentScenarioName, firstWorkspaceParentScenarioId);
            ScenarioParameters.launch();

            // check second child scenario is running with right parameters
            route.browse({ url: `${BREWERY_WORKSPACE_ID}/scenario/${secondWorkspaceChildScenarioId}` });
            Scenarios.getDashboardAccordion().click();
            Scenarios.getDashboardPlaceholder().should('be.visible');
            BreweryParameters.switchToDatasetPartsTab();
            BreweryParameters.getExampleDatasetPart1FileName().should('have.text', FILE_PATH_1);

            // launch second parent scenario
            ScenarioSelector.selectScenario(secondWorkspaceParentScenarioName, secondWorkspaceParentScenarioId);
            ScenarioParameters.launch();

            // check the first parent scenario is running
            route.browse({ url: `${REAL_BREWERY_WORKSPACE_ID}/scenario/${firstWorkspaceParentScenarioId}` });
            Scenarios.getDashboardAccordion().click();
            Scenarios.getDashboardPlaceholder().should('be.visible');

            // check the second parent scenario is running
            route.browse({ url: `${BREWERY_WORKSPACE_ID}/scenario/${secondWorkspaceParentScenarioId}` });
            Scenarios.getDashboardAccordion().click();
            Scenarios.getDashboardPlaceholder().should('be.visible');

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
    });
  });

  it('checks that two identical scenarios can exist in two workspaces', () => {
    Login.login();
    Workspaces.getWorkspacesView(10).should('exist');
    Workspaces.selectWorkspace(REAL_BREWERY_WORKSPACE_ID);

    // create first scenario, update its parameters
    Scenarios.createScenario(sharedNameScenario, true, DATASET.BREWERY_ADT, RUN_TEMPLATE.BREWERY_PARAMETERS).then(
      (value) => {
        firstWorkspaceSharedScenarioId = value.scenarioCreatedId;
        Scenarios.getScenarioLoadingSpinner(15).should('exist').should('not.be.visible');
        BreweryParameters.getStockInput().clear().type('400');
        BreweryParameters.getRestockInput().clear().type('10');
        BreweryParameters.getWaitersInput().clear().type('15');
        ScenarioParameters.save();

        Workspaces.switchToWorkspaceView();
        Workspaces.selectWorkspace(BREWERY_WORKSPACE_ID);

        // create second scenario, update its parameters (same as for the first one)
        Scenarios.createScenario(sharedNameScenario, true, DATASET.BREWERY_ADT, RUN_TEMPLATE.BREWERY_PARAMETERS).then(
          (value) => {
            secondWorkspaceSharedScenarioId = value.scenarioCreatedId;
            Scenarios.getScenarioLoadingSpinner(15).should('exist').should('not.be.visible');
            BreweryParameters.getStockInput().clear().type('400');
            BreweryParameters.getRestockInput().clear().type('10');
            BreweryParameters.getWaitersInput().clear().type('15');
            ScenarioParameters.save();
            // FIXME: find a better work-around to prevent "elements detached from DOM" error. Maybe some queries are
            // causing a re-render of all scenario parameters ?
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(2000);

            // finding second scenario in scenarios' list and checking its url
            ScenarioSelector.selectScenario(sharedNameScenario, secondWorkspaceSharedScenarioId);
            cy.url({ timeout: 3000 }).should('include', secondWorkspaceSharedScenarioId);

            Workspaces.switchToWorkspaceView();
            Workspaces.selectWorkspace(REAL_BREWERY_WORKSPACE_ID);

            // finding first scenario in scenarios' list and checking its url
            ScenarioSelector.selectScenario(sharedNameScenario, firstWorkspaceSharedScenarioId);
            cy.url({ timeout: 3000 }).should('include', firstWorkspaceSharedScenarioId);

            // validate first scenario
            Scenarios.getScenarioValidateButton().should('be.visible').should('not.be.disabled');
            Scenarios.validateScenario(firstWorkspaceSharedScenarioId);

            // reject second scenario
            route.browse({ url: `${BREWERY_WORKSPACE_ID}/scenario/${secondWorkspaceSharedScenarioId}` });
            Scenarios.getScenarioRejectButton().should('be.visible').should('not.be.disabled');
            Scenarios.rejectScenario(secondWorkspaceSharedScenarioId);

            // browse to the first workspace scenario manager, check first scenario validation status and rename it
            route.browse({
              url: `${REAL_BREWERY_WORKSPACE_ID}/scenariomanager`,
              workspaceId: REAL_BREWERY_WORKSPACE_ID,
            });
            ScenarioManager.checkValidationStatus(sharedNameScenario, firstWorkspaceSharedScenarioId, 'Validated');
            ScenarioManager.renameScenario(firstWorkspaceSharedScenarioId, newSharedNameScenario);
            Scenarios.switchToScenarioView();
            ScenarioSelector.selectScenario(newSharedNameScenario, firstWorkspaceSharedScenarioId);

            Workspaces.switchToWorkspaceView();
            Workspaces.selectWorkspace(BREWERY_WORKSPACE_ID);

            // go to the second workspace, switch to the scenario manager,
            // check second scenario validation status, rename it and check its name
            ScenarioManager.switchToScenarioManager();
            ScenarioManager.checkValidationStatus(sharedNameScenario, secondWorkspaceSharedScenarioId, 'Rejected');
            ScenarioManager.renameScenario(secondWorkspaceSharedScenarioId, newSharedNameScenario);
            Scenarios.switchToScenarioView();
            ScenarioSelector.selectScenario(newSharedNameScenario, secondWorkspaceSharedScenarioId);

            // browse to the first scenario, check its name and delete it
            route.browse({ url: `${REAL_BREWERY_WORKSPACE_ID}/scenario/${firstWorkspaceSharedScenarioId}` });
            ScenarioSelector.getScenarioSelectorInput(10000).should('have.value', newSharedNameScenario);
            ScenarioManager.switchToScenarioManager();
            ScenarioManager.deleteScenario(newSharedNameScenario);
            Workspaces.switchToWorkspaceView();
            Workspaces.selectWorkspace(BREWERY_WORKSPACE_ID);
            // select second scenario, check its name and delete it
            ScenarioSelector.selectScenario(newSharedNameScenario, secondWorkspaceSharedScenarioId);
            ScenarioSelector.getScenarioSelectorInput(10000).should('have.value', newSharedNameScenario);
            ScenarioManager.switchToScenarioManager();
            ScenarioManager.deleteScenario(newSharedNameScenario);
          }
        );
      }
    );
  });
});
