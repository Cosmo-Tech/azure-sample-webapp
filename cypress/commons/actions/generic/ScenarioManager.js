// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

function switchToScenarioManager() {
  cy.get(GENERIC_SELECTORS.scenario.manager.tabName).click();
}

function deleteScenario(scenarioName) {
  cy.get(GENERIC_SELECTORS.scenario.manager.search).find('input').clear().type(scenarioName);
  cy.get(GENERIC_SELECTORS.scenario.manager.button.delete).click();
  cy.get(GENERIC_SELECTORS.scenario.manager.confirmDeleteDialog).contains('button', 'Confirm').click();
}

export const ScenarioManager = {
  switchToScenarioManager,
  deleteScenario,
};
