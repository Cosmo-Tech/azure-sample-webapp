// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import utils from '../../commons/TestUtils';
import { routeUtils as route } from '../../commons/utils';
import { BREWERY_WORKSPACE_ID, DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { SCENARIO_RUN_IN_PROGRESS } from '../../commons/constants/generic/TestConstants';
import { Scenarios, ScenarioManager, ScenarioParameters } from '../../commons/actions';
import { Login } from '../../commons/actions/brewery';

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});

describe('Launch scenario', () => {
  const randomString = utils.randomStr(7);
  const scenariosCount = 4;
  const scenariosNames = new Array(scenariosCount);
  const scenariosIds = new Array(scenariosCount);
  for (let i = 0; i < scenariosCount; ++i) {
    scenariosNames[i] = `Test Cypress - Launch scenario - ${randomString} - S${i}`;
  }

  before(() => {
    Login.login();
    // Create multiple scenarios
    for (let i = 0; i < scenariosNames.length; ++i) {
      Scenarios.createScenario(scenariosNames[i], true, DATASET.BREWERY_ADT, RUN_TEMPLATE.BREWERY_PARAMETERS).then(
        (data) => {
          scenariosIds[i] = data.scenarioCreatedId;
        }
      );
    }
  });

  beforeEach(() => {
    Login.relogin();
  });

  after(() => {
    ScenarioManager.deleteScenarioList(scenariosNames);
  });

  it('confirmation launch dialog can be hidden', () => {
    route.browse({
      url: `${BREWERY_WORKSPACE_ID}/scenario/${scenariosIds[0]}`,
      workspaceId: BREWERY_WORKSPACE_ID,
      scenarioId: scenariosIds[0],
    });

    ScenarioParameters.getLaunchConfirmDialog().should('not.exist');
    ScenarioParameters.getLaunchButton().click();
    ScenarioParameters.getLaunchConfirmDialog().should('be.visible');
    ScenarioParameters.getDontAskAgainCheckbox().should('not.be.checked');
    ScenarioParameters.checkDontAskAgain();
    ScenarioParameters.getLaunchCancelButton().click();
    ScenarioParameters.getLaunchConfirmDialog().should('not.exist');
    ScenarioParameters.getLaunchButton().click();
    ScenarioParameters.getLaunchConfirmDialog().should('be.visible');
    ScenarioParameters.getDontAskAgainCheckbox().should('not.be.checked');
    ScenarioParameters.getLaunchConfirmButton().click();
    ScenarioParameters.getLaunchConfirmDialog().should('not.exist');
    Scenarios.getDashboardPlaceholder().should('have.text', SCENARIO_RUN_IN_PROGRESS);

    route.browse({
      url: `${BREWERY_WORKSPACE_ID}/scenario/${scenariosIds[1]}`,
      workspaceId: BREWERY_WORKSPACE_ID,
      scenarioId: scenariosIds[1],
    });
    ScenarioParameters.getLaunchButton().click();
    ScenarioParameters.getDontAskAgainCheckbox().should('not.be.checked');
    ScenarioParameters.checkDontAskAgain();
    ScenarioParameters.getLaunchConfirmButton().click();
    ScenarioParameters.getLaunchConfirmDialog().should('not.exist');
    Scenarios.getDashboardPlaceholder().should('have.text', SCENARIO_RUN_IN_PROGRESS);

    route.browse({
      url: `${BREWERY_WORKSPACE_ID}/scenario/${scenariosIds[2]}`,
      workspaceId: BREWERY_WORKSPACE_ID,
      scenarioId: scenariosIds[2],
    });
    ScenarioParameters.getLaunchButton().click();
    ScenarioParameters.getLaunchConfirmDialog().should('not.exist');
    Scenarios.getDashboardPlaceholder().should('have.text', SCENARIO_RUN_IN_PROGRESS);

    cy.clearLocalStorage('dontAskAgainToConfirmLaunch');

    route.browse({
      url: `${BREWERY_WORKSPACE_ID}/scenario/${scenariosIds[3]}`,
      workspaceId: BREWERY_WORKSPACE_ID,
      scenarioId: scenariosIds[3],
    });
    ScenarioParameters.getLaunchButton().click();
    ScenarioParameters.getLaunchConfirmDialog().should('be.visible');
    ScenarioParameters.getDontAskAgainCheckbox().should('not.be.checked');
    ScenarioParameters.getLaunchCancelButton().click();
    ScenarioParameters.getLaunchConfirmDialog().should('not.exist');

    ScenarioParameters.getParametersEditButton().click();
    ScenarioParameters.getParametersUpdateAndLaunchButton().click();
    ScenarioParameters.getLaunchConfirmDialog().should('be.visible');
    ScenarioParameters.getDontAskAgainCheckbox().should('not.be.checked');
    ScenarioParameters.getLaunchConfirmButton().click();
    ScenarioParameters.getLaunchConfirmDialog().should('not.exist');
    Scenarios.getDashboardPlaceholder().should('have.text', SCENARIO_RUN_IN_PROGRESS);
  });
});
