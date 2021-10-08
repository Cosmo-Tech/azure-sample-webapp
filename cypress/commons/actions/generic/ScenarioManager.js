// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { SELECTORS } from '../../IdConstants';

function switchToScenarioManager () {
  cy.get(SELECTORS.scenario.manager.tabName).click();
}

function deleteScenario (scenarioName) {
  cy.get(SELECTORS.scenario.manager.search).clear().type(scenarioName);
  cy.get(SELECTORS.scenario.manager.button.delete).click();
  cy.get(SELECTORS.scenario.manager.confirmDeleteDialog).contains('button', 'Confirm').click();
}

export const ScenarioManager = {
  switchToScenarioManager,
  deleteScenario
};
