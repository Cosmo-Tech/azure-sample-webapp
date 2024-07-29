// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { Scenarios, ScenarioManager, Login, ScenarioSelector } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { DEFAULT_DATASETS_LIST, DEFAULT_SOLUTION } from '../../fixtures/stubbing/default';

describe('If there are no scenarios created yet', () => {
  before(() => {
    stub.start();
  });

  beforeEach(() => {
    stub.setScenarios([]);
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('can navigate & create a first scenario', () => {
    Scenarios.getDashboardPlaceholder().should(
      'have.text',
      'You can create a scenario by clicking on the "CREATE" button'
    );
    ScenarioSelector.getScenarioSelectorInput().should('be.disabled');

    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioAccordions().should('have.length', 0);

    Scenarios.switchToScenarioView();
    const scenarioName = 'Test Cypress no scenario  - ' + utils.randomStr(7);

    Scenarios.createScenario(
      scenarioName,
      true,
      DEFAULT_DATASETS_LIST[0].name,
      DEFAULT_SOLUTION.runTemplates[0].name
    ).then((value) => {
      const scenarioId = value.scenarioCreatedId;
      ScenarioManager.switchToScenarioManager();
      ScenarioManager.getScenarioAccordion(scenarioId).click();
    });

    ScenarioManager.deleteScenario(scenarioName);
    ScenarioManager.getScenarioAccordions().should('have.length', 0);

    Scenarios.switchToScenarioView();
    ScenarioSelector.getScenarioSelectorInput().should('be.disabled');
    Scenarios.getDashboardPlaceholder().should(
      'have.text',
      'You can create a scenario by clicking on the "CREATE" button'
    );
  });
});
