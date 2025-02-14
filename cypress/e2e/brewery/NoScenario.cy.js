// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { Scenarios, ScenarioManager, Login, ScenarioSelector } from '../../commons/actions';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { stub } from '../../commons/services/stubbing';

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

    Scenarios.createScenario(scenarioName, true, DATASET.BREWERY_STORAGE, RUN_TEMPLATE.BASIC_TYPES).then((value) => {
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
