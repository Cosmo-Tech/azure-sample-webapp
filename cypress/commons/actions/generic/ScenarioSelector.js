// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Select the scenario with the provided name and id
import { apiUtils as api } from '../../utils';
import { ScenarioParameters } from './ScenarioParameters';
import { Scenarios } from './Scenarios';

function selectScenario(scenarioName, scenarioId) {
  const getScenarioAlias = api.interceptGetScenario(scenarioId);
  Scenarios.writeInScenarioSelectorInput(scenarioName);
  Scenarios.getScenarioSelectorOption(scenarioId).should('be.visible').should('not.be.disabled');
  Scenarios.getScenarioSelectorOption(scenarioId).click();

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
  selectScenario,
};
