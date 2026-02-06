// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
// Select the scenario with the provided name and id
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

function getScenarioSelector(timeout = 5) {
  return cy.get(GENERIC_SELECTORS.scenario.selectInput, { timeout: timeout * 1000 });
}
function getScenarioSelectorInput(timeout) {
  return getScenarioSelector(timeout).find('input');
}
function getScenarioSelectorOption(scenarioId) {
  return cy.get(GENERIC_SELECTORS.scenario.scenarioSelectOption.replace('$SCENARIOID', scenarioId), { timeout: 10000 });
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
  getScenarioSelectorInput(10).should('not.be.disabled');
  getScenarioSelectorInput()
    .click({ force: true })
    .type(
      '{selectAll}{backspace}' + searchStr, // clear() does not always work, use "{selectAll}{backspace}" instead
      { force: true } // Force click to handle cases when the error banner is displayed above the selector options
    );
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500); // Wait for dropdown options to load
}

// Parameters:
// - scenarioName (string): character string to write in the scenario selector search field
// - scenarioId (string): scenario id expected in the intercepted queries and elements metadata
// - options (object):
//   - skipEditButtonCheck (bool, default=false): if true, then the function does not perform checks on the state of
//     the edit button after switching to the selected scenario; this option can be useful when the connected user does
//     not have the edit permissions on the selected scenario (i.e. when the edit button is not visible)
function selectScenario(scenarioName, scenarioId, options) {
  writeInScenarioSelectorInput(scenarioName);
  cy.get('ul[role="listbox"]', { timeout: 10000 }).should('be.visible');
  getScenarioSelectorOption(scenarioId).should('be.visible').should('not.be.disabled');
  // Click on the option - use realClick if available for more reliable interaction
  getScenarioSelectorOption(scenarioId).then(($el) => {
    // Scroll the element into view and click
    $el[0].scrollIntoView();
    $el[0].click();
  });
  // Wait for dropdown to close after selection
  cy.get('ul[role="listbox"]', { timeout: 5000 }).should('not.exist');
  // Wait for the input value to update
  ScenarioSelector.getScenarioSelectorInput().should('have.value', scenarioName);
  // Wait for URL to update with the selected scenario ID
  cy.url().should('include', scenarioId);
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
