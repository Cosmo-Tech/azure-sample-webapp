// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import utils from '../../commons/TestUtils';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { Scenarios, ScenarioManager, Login } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { setup } from '../../commons/utils/setup';

describe('If there are no scenarios created yet', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start({
      CREATE_AND_DELETE_SCENARIO: true,
      GET_DATASETS: true,
      GET_SCENARIOS: true,
    });
    Login.login();
  });

  beforeEach(() => {
    stub.setScenarios([]);
    Login.relogin();
  });

  after(() => {
    stub.stop();
  });

  it('can navigate & create a first scenario', () => {
    Scenarios.getDashboardPlaceholder().should(
      'have.text',
      'You can create a scenario by clicking on the "CREATE" button'
    );
    Scenarios.getScenarioSelectorInput().should('be.disabled');

    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioAccordions().should('have.length', 0);

    Scenarios.switchToScenarioView();
    const scenarioName = 'Test Cypress no scenario  - ' + utils.randomStr(7);

    Scenarios.createScenario(scenarioName, true, DATASET.BREWERY_ADT, RUN_TEMPLATE.BASIC_TYPES).then((value) => {
      const scenarioId = value.scenarioCreatedId;
      ScenarioManager.switchToScenarioManager();
      ScenarioManager.getScenarioAccordion(scenarioId).click();
    });

    ScenarioManager.deleteScenario(scenarioName);
    ScenarioManager.getScenarioAccordions().should('have.length', 0);

    Scenarios.switchToScenarioView();
    Scenarios.getScenarioSelectorInput().should('be.disabled');
    Scenarios.getDashboardPlaceholder().should(
      'have.text',
      'You can create a scenario by clicking on the "CREATE" button'
    );
  });
});
