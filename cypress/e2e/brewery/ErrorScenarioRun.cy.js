// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { Scenarios, ScenarioManager, ScenarioParameters, ErrorBanner } from '../../commons/actions';
import { Login } from '../../commons/actions/brewery';
import { BREWERY_WORKSPACE_ID, DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { URL_REGEX } from '../../commons/constants/generic/TestConstants';

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});

const SCENARIO_DATASET = DATASET.BREWERY_ADT;
const SCENARIO_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;

function forgeScenarioName() {
  const prefix = 'Scenario - ';
  const randomString = utils.randomStr(7);
  return prefix + randomString;
}

describe('Displaying error banner on run scenario fail', () => {
  const scenarioName = forgeScenarioName();

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.deleteScenario(scenarioName);
  });
  it('can display error banner and dismiss it', () => {
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);
    cy.intercept('POST', URL_REGEX.SCENARIO_PAGE_RUN_WITH_ID, {
      statusCode: 400,
      body: {
        title: 'Bad Request',
        status: 400,
        detail: `Scenario #scenarioId not found in workspace #${BREWERY_WORKSPACE_ID} in organization #O-gZYpnd27G7`,
      },
    });
    // Do not use "launch" action to be able to use our custom 'intercept'
    ScenarioParameters.getLaunchButton(180).should('not.be.disabled').click();
    ErrorBanner.checkAnDismissErrorBanner();
    Scenarios.getDashboardAccordionLogsDownloadButton().should('not.exist');
  });
});
