// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { stub } from '../../services/stubbing';
import { apiUtils as api } from '../../utils';
import { Scenarios } from '../generic';

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
  options?.datasetsEvents?.reverse()?.forEach((datasetEvent) => {
    aliases.push(api.interceptCreateDataset({ id: datasetEvent.id, validateRequest: datasetEvent.onDatasetCreation }));
    aliases.push(api.interceptUpdateDataset({ id: datasetEvent.id, validateRequest: datasetEvent.onDatasetUpdate }));
    aliases.push(
      ...api.interceptUpdateDatasetSecurity({ id: datasetEvent.id, securityChanges: datasetEvent.securityChanges })
    );
    aliases.push(api.interceptUploadWorkspaceFile());
  });
  getLaunchButton(options?.getLaunchButtonTimeout ?? 180)
    .should('not.be.disabled')
    .click();
  api.waitAliases(aliases, { timeout: 60 * 1000 });
}

// Parameter 'options' is an object with the following properties:
//  - wait: whether the action must wait for the update request interception (true by default). Set this option to false
//    if you want to handle the request interception in your test or if you want to ignore it. This option is forced to
//    true if the option 'datasetsEvents' is set.
//  - updateOptions: options to provide to the interception of the "scenario update" query (default: undefined)
//  - datasetsEvents: list of objects describing dataset-related queries to intercept; objects have this structure;
//    - id (optional): id of the dataset to create
//    - onDatasetCreation (optional): validation function to run on the dataset creation request
//    - onDatasetUpdate (optional): validation function to run on the dataset update request
//    - securityChanges (optional): object containing only the differences of security that are applied to the created
//      dataset. This object defines how queries must be intercepted when stubbing is enabled. The expected format
//      is the same as the security objects of API resources, with an additional field "type" with one of the values
//      "post", "patch", or "delete". Example:
//      {default: "viewer", accessControlList: [{id: "john.doe@example.com", role: "admin", type: "patch"}]}
function save(options = {}) {
  const aliases = [];
  // Events array is reversed to make tests easier to write and still match the order of cypress interceptions
  // (c.f. cy.intercept doc: "cy.intercept() routes are matched in reverse order of definition")
  options?.datasetsEvents?.reverse()?.forEach((datasetEvent) => {
    aliases.push(api.interceptCreateDataset({ id: datasetEvent.id, validateRequest: datasetEvent.onDatasetCreation }));
    aliases.push(api.interceptUpdateDataset({ id: datasetEvent.id, validateRequest: datasetEvent.onDatasetUpdate }));
    aliases.push(
      ...api.interceptUpdateDatasetSecurity({ id: datasetEvent.id, securityChanges: datasetEvent.securityChanges })
    );
    aliases.push(api.interceptUploadWorkspaceFile());
  });

  const reqUpdateScenarioAlias = api.interceptUpdateScenario(options?.updateOptions);
  aliases.push(reqUpdateScenarioAlias);

  getSaveButton().should('not.be.disabled').click();
  if (options?.datasetsEvents != null || (options?.wait ?? true)) {
    Scenarios.getScenarioBackdrop(10).should('not.be.visible');
    api.waitAliases(aliases, { timeout: 10 * 1000 });
  } else return reqUpdateScenarioAlias;
}

function cancelRun(confirm = true) {
  const reqStopScenarioRunAlias = confirm && api.interceptStopScenarioRun();
  getStopScenarioRunButton().click();
  if (confirm) {
    getStopScenarioRunConfirmButton().click();
    api.waitAlias(reqStopScenarioRunAlias);
  } else getStopScenarioRunCancelButton().click();
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
