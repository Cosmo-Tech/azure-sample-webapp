// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import utils from '../../commons/TestUtils';
import { SCENARIO_NAME, DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { SCENARIO_RUN_IN_PROGRESS } from '../../commons/constants/generic/TestConstants';
import { Scenarios, ScenarioManager, ScenarioParameters, Login } from '../../commons/actions';

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});

describe('Launch scenario', () => {
  const randomString = utils.randomStr(7);
  const scenariosCount = 4;
  const scenariosNames = new Array(scenariosCount);
  const scenariosIds = new Array(scenariosCount);
  for (let i = 0; i < scenariosCount; ++i) {
    scenariosNames[i] = SCENARIO_NAME.SCENARIO_MASTER + i + ' - ' + randomString;
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
    Scenarios.selectScenario(scenariosNames[0], scenariosIds[0]);

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

    Scenarios.selectScenario(scenariosNames[1], scenariosIds[1]);
    ScenarioParameters.getLaunchButton().click();
    ScenarioParameters.getDontAskAgainCheckbox().should('not.be.checked');
    ScenarioParameters.checkDontAskAgain();
    ScenarioParameters.getLaunchConfirmButton().click();
    ScenarioParameters.getLaunchConfirmDialog().should('not.exist');
    Scenarios.getDashboardPlaceholder().should('have.text', SCENARIO_RUN_IN_PROGRESS);

    Scenarios.selectScenario(scenariosNames[2], scenariosIds[2]);
    ScenarioParameters.getLaunchButton().click();
    ScenarioParameters.getLaunchConfirmDialog().should('not.exist');
    Scenarios.getDashboardPlaceholder().should('have.text', SCENARIO_RUN_IN_PROGRESS);

    cy.clearLocalStorage('dontAskAgainToConfirmLaunch');
    Scenarios.selectScenario(scenariosNames[3], scenariosIds[3]);
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
