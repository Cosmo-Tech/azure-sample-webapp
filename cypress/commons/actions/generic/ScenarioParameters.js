// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { URL_REGEX } from '../../constants/generic/TestConstants';
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

// Get elements in scenario parameters panel
function getParametersTabs() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.tabs);
}
function getParametersAccordionSummary() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.accordionSummary);
}
//  - timeout: max time to wait before throwing an error (seconds)
function getParametersEditButton(timeout = 5) {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.editButton, { timeout: timeout * 1000 });
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
function expandParametersAccordion() {
  getParametersAccordionSummary()
    .invoke('attr', 'aria-expanded')
    .then(($val) => {
      if ($val === 'false') {
        getParametersAccordionSummary().click();
      }
    });
}
function collapseParametersAccordion() {
  getParametersAccordionSummary()
    .invoke('attr', 'aria-expanded')
    .then(($val) => {
      if ($val === 'true') {
        getParametersAccordionSummary().click();
      }
    });
}
function edit(timeout = 5) {
  getParametersEditButton(timeout).should('not.be.disabled').click();
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

// Actions on input components
function getInputValue(inputElement) {
  return inputElement.invoke('attr', 'value');
}

export const ScenarioParameters = {
  getParametersTabs,
  getParametersAccordionSummary,
  getParametersEditButton,
  getParametersDiscardButton,
  getParametersUpdateAndLaunchButton,
  expandParametersAccordion,
  collapseParametersAccordion,
  edit,
  discard,
  updateAndLaunch,
  getInputValue,
};
