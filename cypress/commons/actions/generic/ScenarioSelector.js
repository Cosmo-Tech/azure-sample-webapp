// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
// Select the scenario with the provided name and id
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { apiUtils as api } from '../../utils';
import { Scenarios } from './Scenarios';

function getScenarioSelector(timeout = 5) {
  return cy.get(GENERIC_SELECTORS.scenario.selectInput, { timeout: timeout * 1000 });
}
function getScenarioSelectorInput(timeout) {
  return getScenarioSelector(timeout).find('input');
}
function getScenarioSelectorOption(scenarioId) {
  return cy.get(GENERIC_SELECTORS.scenario.scenarioSelectOption.replace('$SCENARIOID', scenarioId));
}
function getScenarioSelectorOptionValidationStatusChip(scenarioId) {
  return getScenarioSelectorOption(scenarioId).find(GENERIC_SELECTORS.scenario.validationStatusChip);
}
function getScenarioSelectorOptionValidationStatusLoadingSpinner(scenarioId) {
  return getScenarioSelectorOption(scenarioId).find(GENERIC_SELECTORS.scenario.validationStatusLoadingSpinner);
}
function checkValidationStatusInScenarioSelector(searchStr, scenarioId, expectedStatus) {
  writeInScenarioSelectorInput(searchStr);
  switch (expectedStatus) {
    case 'Draft':
    case 'Unknown':
      getScenarioSelectorOptionValidationStatusChip(scenarioId).should('not.exist');
      getScenarioSelectorOptionValidationStatusLoadingSpinner(scenarioId).should('not.exist');
      break;
    case 'Validated':
      getScenarioSelectorOptionValidationStatusChip(scenarioId).should('be.visible');
      getScenarioSelectorOptionValidationStatusChip(scenarioId).should('have.text', 'Validated');
      getScenarioSelectorOptionValidationStatusLoadingSpinner(scenarioId).should('not.exist');
      break;
    case 'Rejected':
      getScenarioSelectorOptionValidationStatusChip(scenarioId).should('be.visible');
      getScenarioSelectorOptionValidationStatusChip(scenarioId).should('have.text', 'Rejected');
      getScenarioSelectorOptionValidationStatusLoadingSpinner(scenarioId).should('not.exist');
      break;
    case 'Loading':
      getScenarioSelectorOptionValidationStatusChip(scenarioId).should('not.exist');
      getScenarioSelectorOptionValidationStatusLoadingSpinner(scenarioId).should('be.visible');
      break;
    default:
      throw new Error(
        `Unknown expected scenario status "${expectedStatus}". Please use one of ` +
          'Draft, Unknown, Loading, Validated, Rejected.'
      );
  }
  writeInScenarioSelectorInput('{esc}');
}

function writeInScenarioSelectorInput(searchStr) {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(0); // Prevent refresh in progress
  getScenarioSelectorInput().should('not.be.disabled');
  getScenarioSelectorInput()
    .click()
    .type(
      '{selectAll}{backspace}' + searchStr, // clear() does not always work, use "{selectAll}{backspace}" instead
      { force: true } // Force click to handle cases when the error banner is displayed above the selector options
    );
}

// Parameters:
// - scenarioName (string): character string to write in the scenario selector search field
// - scenarioId (string): scenario id expected in the intercepted queries and elements metadata
// - options (object):
//   - skipEditButtonCheck (bool, default=false): if true, then the function does not perform checks on the state of
//     the edit button after switching to the selected scenario; this option can be useful when the connected user does
//     not have the edit permissions on the selected scenario (i.e. when the edit button is not visible)
function selectScenario(scenarioName, scenarioId, options) {
  const getScenarioAlias = api.interceptGetScenario(scenarioId);
  writeInScenarioSelectorInput(scenarioName);
  getScenarioSelectorOption(scenarioId).should('be.visible').should('not.be.disabled');
  getScenarioSelectorOption(scenarioId).click();

  api
    .waitAlias(getScenarioAlias)
    .its('response')
    .its('body')
    .then((req) => {
      expect(req.name).equal(scenarioName);
      cy.location().then((location) => {
        if (location.href.includes('scenario')) {
          Scenarios.getScenarioLoadingSpinner(15).should('exist').should('not.be.visible');
        }
      });
    });
}

export const ScenarioSelector = {
  checkValidationStatusInScenarioSelector,
  getScenarioSelector,
  getScenarioSelectorInput,
  getScenarioSelectorOption,
  getScenarioSelectorOptionValidationStatusChip,
  getScenarioSelectorOptionValidationStatusLoadingSpinner,
  selectScenario,
  writeInScenarioSelectorInput,
};
