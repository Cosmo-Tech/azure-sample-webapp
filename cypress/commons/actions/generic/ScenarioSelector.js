// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Select the scenario with the provided name and id
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { apiUtils as api } from '../../utils';
import { ScenarioParameters } from './ScenarioParameters';
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
  return getScenarioSelector()
    .click()
    .should('not.be.disabled')
    .type('{selectAll}{backspace}' + searchStr); // clear() does not always work, use "{selectAll}{backspace}" instead
}

function selectScenario(scenarioName, scenarioId) {
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
          if (req.state === 'Running' || req.validationStatus !== 'Draft') {
            ScenarioParameters.getParametersEditButton().should('be.disabled');
          } else {
            ScenarioParameters.getParametersEditButton().should('not.be.disabled');
          }
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
