// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { USERS_LIST } from '../../../tests/samples';
import { Login, ScenarioManager } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { setup } from '../../commons/utils';
import { SCENARIOS } from '../../fixtures/stubbing/ScenarioManager-SearchBar/scenarios';

const getFirstCharacters = (string) => string.substring(0, 3);

describe('Search bar in scenario manager view', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start();
    stub.setScenarios(SCENARIOS);
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });
  it('can search scenarios by run status and ownerName', () => {
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioAccordions().should('have.length', SCENARIOS.length);
    ScenarioManager.writeInFilter('Successful');
    ScenarioManager.getScenarioAccordions().should(
      'have.length',
      SCENARIOS.filter((scenario) => scenario.state === 'Successful')?.length
    );
    ScenarioManager.writeInFilter(getFirstCharacters('Failed'));
    ScenarioManager.getScenarioAccordions().should(
      'have.length',
      SCENARIOS.filter((scenario) => scenario.state === 'Failed')?.length
    );
    ScenarioManager.writeInFilter(getFirstCharacters(USERS_LIST[1].name));
    ScenarioManager.getScenarioAccordions().should(
      'have.length',
      SCENARIOS.filter((scenario) => scenario.ownerName === USERS_LIST[1].name)?.length
    );
    ScenarioManager.writeInFilter('zero filter results');
    ScenarioManager.getScenarioAccordions().should('have.length', 0);
  });
  it('can search scenarios by validation status', () => {
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.writeInFilter(getFirstCharacters('Validated'));
    ScenarioManager.getScenarioAccordions().should(
      'have.length',
      SCENARIOS.filter((scenario) => scenario.validationStatus === 'Validated')?.length
    );
    ScenarioManager.writeInFilter(getFirstCharacters('Rejected'));
    ScenarioManager.getScenarioAccordions().should(
      'have.length',
      SCENARIOS.filter((scenario) => scenario.validationStatus === 'Rejected')?.length
    );
  });
  it('can search scenarios by tags and description', () => {
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.writeInFilter(getFirstCharacters('supply'));
    ScenarioManager.getScenarioAccordions().should(
      'have.length',
      SCENARIOS.filter((scenario) => scenario.tags?.includes('supply') || scenario.description?.includes('supply'))
        ?.length
    );
    ScenarioManager.writeInFilter(getFirstCharacters('global'));
    ScenarioManager.getScenarioAccordions().should(
      'have.length',
      SCENARIOS.filter(
        (scenario) =>
          scenario.name.includes('global') ||
          scenario.tags?.includes('global') ||
          scenario.description?.includes('global')
      )?.length
    );
  });
  it('can search scenarios by name, tags and description', () => {
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.writeInFilter(getFirstCharacters('unique'));
    ScenarioManager.getScenarioAccordions().should(
      'have.length',
      SCENARIOS.filter((scenario) => scenario.tags?.includes('unique'))?.length
    );
    ScenarioManager.writeInFilter('supply chain');
    ScenarioManager.getScenarioAccordions().should(
      'have.length',
      SCENARIOS.filter((scenario) => scenario.description?.includes('supply chain'))?.length
    );
    ScenarioManager.writeInFilter(getFirstCharacters('Simple'));
    ScenarioManager.getScenarioAccordions().should(
      'have.length',
      SCENARIOS.filter((scenario) => scenario.name.toLowerCase().includes('simple'))?.length
    );
  });
});
