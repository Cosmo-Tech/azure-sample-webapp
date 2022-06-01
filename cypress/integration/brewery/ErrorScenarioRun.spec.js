// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import 'cypress-file-upload';
import utils from '../../commons/TestUtils';

import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { Downloads, Login, Scenarios, ScenarioManager, ScenarioParameters } from '../../commons/actions';
import { URL_REGEX } from '../../commons/constants/generic/TestConstants';

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});

const SCENARIO_DATASET = DATASET.BREWERY_ADT;
const SCENARIO_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;

function forgeScenarioName() {
  const prefix = 'Scenario - ';
  return `${prefix}${utils.randomStr(7)}`;
}

describe('Displaying error banner on run scenario fail', () => {
  before(() => {
    Login.login();
  });

  beforeEach(() => {
    Login.relogin();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    Downloads.clearDownloadsFolder();
    // Delete all tests scenarios
    ScenarioManager.switchToScenarioManager();
    for (const scenarioName of scenarioNamesToDelete) {
      ScenarioManager.deleteScenario(scenarioName);
    }
  });
  it('can display error banner and dismiss it', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    ScenarioParameters.getLaunchButton().click();
    ScenarioParameters.checkDontAskAgain();
    ScenarioParameters.getLaunchConfirmButton().click();
    cy.intercept('POST', URL_REGEX.SCENARIO_PAGE_RUN_WITH_ID, {
      statusCode: 400,
      body: {
        title: 'Bad Request',
        status: 400,
        detail: 'Scenario #scenarioId not found in workspace #W-rXeBwRa0PM in organization #O-gZYpnd27G7',
      },
    });
    Scenarios.getErrorBanner().should('be.visible');
    Scenarios.getDismissErrorButton().click();
    Scenarios.getErrorBanner().should('not.exist');
  });
});
