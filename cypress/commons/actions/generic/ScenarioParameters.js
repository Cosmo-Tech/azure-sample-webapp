// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { URL_REGEX } from '../../constants/generic/TestConstants';
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

// Get elements in scenario parameters panel
function getParametersEditButton() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.editButton);
}
function getParametersDiscardButton() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.discardButton);
}
function getParametersConfirmDiscardButton() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.dialogDiscardButton);
}
function getParametersUpdateAndLaunchButton() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.updateAndLaunchButton);
}

// Actions around scenario parameters
function edit() {
  getParametersEditButton().click();
}
function discard() {
  getParametersDiscardButton().click();
  getParametersConfirmDiscardButton().click();
}
function updateAndLaunch() {
  cy.intercept('POST', URL_REGEX.SCENARIO_PAGE_RUN_WITH_ID).as('requestRunScenario');
  getParametersUpdateAndLaunchButton().click();
  cy.wait('@requestRunScenario');
}

export const ScenarioParameters = {
  getParametersEditButton,
  getParametersDiscardButton,
  getParametersUpdateAndLaunchButton,
  edit,
  discard,
  updateAndLaunch,
};
