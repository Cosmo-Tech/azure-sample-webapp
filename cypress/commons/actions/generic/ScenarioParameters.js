// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { URL_REGEX } from '../../constants/generic/TestConstants';
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { apiUtils as api } from '../../utils';

// Get elements in scenario parameters panel
function getParametersTabs(timeout = 4) {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.tabs, { timeout: timeout * 1000 });
}
function getParametersAccordionSummary() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.accordionSummary);
}

// Generic get & set actions for scenario parameters
function getParameterContainer(id) {
  return cy.get(`[data-cy=${id}]`);
}
function getParameterValue(id) {
  return getParameterContainer(id).find(GENERIC_SELECTORS.genericComponents.basicInput.disabledInputValue);
}
function getParameterInput(id) {
  return getParameterContainer(id).find(GENERIC_SELECTORS.genericComponents.basicInput.input);
}

// TODO: add generic setters for scenario parameters input ()

//  - timeout: max time to wait before throwing an error (seconds)
function getParametersEditButton(timeout = 4) {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.editButton, { timeout: timeout * 1000 });
}
function getParametersDiscardButton() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.discardButton);
}
function getParametersConfirmDiscardButton() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.dialogDiscardButton);
}
function getLaunchButton(timeout) {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.launchButton, timeout ? { timeout: timeout * 1000 } : undefined);
}
function getParametersUpdateAndLaunchButton(timeout) {
  return cy.get(
    GENERIC_SELECTORS.scenario.parameters.updateAndLaunchButton,
    timeout ? { timeout: timeout * 1000 } : undefined
  );
}
function getLaunchConfirmDialog() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.dialogLaunch.dialogTitle);
}
function getLaunchConfirmButton() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.dialogLaunch.confirmButton);
}
function getLaunchCancelButton() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.dialogLaunch.cancelButton);
}
function getDontAskAgainCheckbox() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.dialogLaunch.dontAskAgainCheckbox).find('input');
}
function checkDontAskAgain() {
  getDontAskAgainCheckbox().check();
}
function getNoParametersPlaceholder() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.noParametersPlaceholder);
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
function edit(timeout) {
  getParametersEditButton(timeout).should('not.be.disabled').click();
}
function discard() {
  getParametersDiscardButton().click();
  getParametersConfirmDiscardButton().click();
}

function launch(dontAskAgain = false, withUpdate = false, timeoutGetLaunchButton = 180) {
  const alias = api.forgeAlias('reqRunScenarioAlias');
  cy.intercept('POST', URL_REGEX.SCENARIO_PAGE_RUN_WITH_ID).as(alias);

  if (withUpdate) {
    getParametersUpdateAndLaunchButton(timeoutGetLaunchButton).should('not.be.disabled').click();
  } else {
    getLaunchButton(timeoutGetLaunchButton).should('not.be.disabled').click();
  }
  if (localStorage.getItem('dontAskAgainToConfirmLaunch') !== 'true') {
    if (dontAskAgain) {
      checkDontAskAgain();
    }
    getLaunchConfirmButton().click();
  }

  api.waitAlias(alias, { timeout: 60 * 1000 }); // 60 seconds timeout
}

function updateAndLaunch(dontAskAgain = false) {
  launch(dontAskAgain, true);
}

// Actions on input components
function getInputValue(inputElement) {
  return inputElement.invoke('attr', 'value');
}
function getTextField(textElement) {
  return textElement.invoke('text');
}

export const ScenarioParameters = {
  getParametersTabs,
  getParametersAccordionSummary,
  getParameterContainer,
  getParameterValue,
  getParameterInput,
  getParametersEditButton,
  getParametersDiscardButton,
  getParametersConfirmDiscardButton,
  getLaunchButton,
  getParametersUpdateAndLaunchButton,
  getLaunchConfirmDialog,
  getLaunchConfirmButton,
  getLaunchCancelButton,
  getDontAskAgainCheckbox,
  checkDontAskAgain,
  getNoParametersPlaceholder,
  expandParametersAccordion,
  collapseParametersAccordion,
  edit,
  discard,
  updateAndLaunch,
  launch,
  getInputValue,
  getTextField,
};
