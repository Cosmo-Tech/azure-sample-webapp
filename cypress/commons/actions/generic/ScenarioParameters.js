// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { URL_REGEX } from '../../constants/generic/TestConstants';
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { Scenarios } from '../generic';
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
function getParametersDiscardButton() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.discardButton);
}
function getParametersConfirmDiscardButton() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.dialogDiscardButton);
}
function getLaunchButton(timeout) {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.launchButton, timeout ? { timeout: timeout * 1000 } : undefined);
}
function getSaveButton(timeout) {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.saveButton, timeout ? { timeout: timeout * 1000 } : undefined);
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

function discard() {
  getParametersDiscardButton().click();
  getParametersConfirmDiscardButton().click();
}

function launch(timeoutGetLaunchButton = 180) {
  const alias = api.forgeAlias('reqRunScenarioAlias');
  cy.intercept('POST', URL_REGEX.SCENARIO_PAGE_RUN_WITH_ID).as(alias);

  getLaunchButton(timeoutGetLaunchButton).should('not.be.disabled').click();

  api.waitAlias(alias, { timeout: 60 * 1000 }); // 60 seconds timeout
}

function save(wait = true) {
  const alias = api.forgeAlias('reqSaveScenarioAlias');
  cy.intercept('PATCH', URL_REGEX.SCENARIO_PAGE_WITH_ID).as(alias);

  getSaveButton().should('not.be.disabled').click();

  if (wait) {
    Scenarios.getScenarioBackdrop(10).should('not.be.visible');
    api.waitAlias(alias, { timeout: 10 * 1000 }); // 10 seconds timeout
  }
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
  getParametersDiscardButton,
  getParametersConfirmDiscardButton,
  getLaunchButton,
  getSaveButton,
  getNoParametersPlaceholder,
  expandParametersAccordion,
  collapseParametersAccordion,
  discard,
  launch,
  save,
  getInputValue,
  getTextField,
};
