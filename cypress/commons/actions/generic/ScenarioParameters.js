// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { Scenarios } from '../generic';
import { apiUtils as api } from '../../utils';
import { stub } from '../../services/stubbing';

// Get elements in scenario parameters panel
function getParametersTabs(timeout = 4) {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.tabs, { timeout: timeout * 1000 });
}
function getParametersAccordionSummary() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.accordionSummary);
}
function getTabsErrorBadge(container) {
  return container.find('[data-cy=error-badge]');
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
function getStopScenarioRunButton(timeout) {
  return cy.get(
    GENERIC_SELECTORS.scenario.parameters.stopScenarioRunButton,
    timeout ? { timeout: timeout * 1000 } : undefined
  );
}
function getStopScenarioRunConfirmButton() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.stopScenarioDialogButton2);
}
function getStopScenarioRunCancelButton() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.stopScenarioDialogButton1);
}

function getParametersDiscardAndContinueButton() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.dialogDiscardAndContinueButton);
}

function getParametersCancelDiscardAndContinueButton() {
  return cy.get(GENERIC_SELECTORS.scenario.parameters.dialogDiscardAndContinueCancelButton);
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

function discardAndContinue() {
  getParametersDiscardAndContinueButton().click();
}

function cancelDiscardAndContinue() {
  getParametersCancelDiscardAndContinueButton().click();
}

// Parameter 'options' is an object with the following properties:
//  - scenarioId: scenario id to provide to the interception of the "get scenario" query (default: undefined)
//  - runOptions: options to provide to the interception of the "get scenario run" query (default: undefined)
//  - saveAndLaunch: boolean defining whether the test will trigger a SAVE of the scenario parameters (default:
//    false); used only when stubbing is enabled, to add interception of scenario updates
//  - getLaunchButtonTimeout: maximum timeout, in seconds, before raising an error when waiting for the launch button
//    to be enabled (default: 180)
function launch(options) {
  const expectedPollsCount = options?.runOptions?.expectedPollsCount ?? stub.getScenarioRunOptions().expectedPollsCount;
  const aliases = [
    options?.saveAndLaunch ? api.interceptUpdateScenario() : undefined,
    api.interceptLaunchScenario(options?.runOptions),
    api.interceptGetScenario(options?.scenarioId, expectedPollsCount),
    api.interceptGetScenarioRun(),
    api.interceptGetScenarioRunStatus(),
  ];
  getLaunchButton(options?.getLaunchButtonTimeout ?? 180)
    .should('not.be.disabled')
    .click();
  api.waitAliases(aliases, { timeout: 60 * 1000 });
}

function save(wait = true, customScenarioPatch) {
  const reqUpdateScenarioAlias = api.interceptUpdateScenario({ customScenarioPatch });
  getSaveButton().should('not.be.disabled').click();
  if (wait) {
    Scenarios.getScenarioBackdrop(10).should('not.be.visible');
    api.waitAlias(reqUpdateScenarioAlias, { timeout: 10 * 1000 });
  } else return reqUpdateScenarioAlias;
}

function cancelRun(confirm = true) {
  getStopScenarioRunButton().click();
  confirm ? getStopScenarioRunConfirmButton().click() : getStopScenarioRunCancelButton().click();
}

function waitForScenarioRunEnd(timeout = 300) {
  getStopScenarioRunButton().should('be.visible');
  getStopScenarioRunButton(timeout).should('not.exist');
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
  getStopScenarioRunButton,
  getStopScenarioRunConfirmButton,
  getStopScenarioRunCancelButton,
  getNoParametersPlaceholder,
  expandParametersAccordion,
  collapseParametersAccordion,
  discard,
  launch,
  save,
  cancelRun,
  waitForScenarioRunEnd,
  getInputValue,
  getTextField,
  discardAndContinue,
  cancelDiscardAndContinue,
  getParametersDiscardAndContinueButton,
  getParametersCancelDiscardAndContinueButton,
  getTabsErrorBadge,
};
