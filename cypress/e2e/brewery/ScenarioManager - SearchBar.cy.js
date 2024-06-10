// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { USERS_LIST } from '../../../tests/samples';
import { Login, ScenarioManager } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { setup } from '../../commons/utils';
import { SCENARIOS, SCENARIO_RUNS } from '../../fixtures/stubbing/ScenarioManager-SearchBar/scenarios';

const getFirstCharacters = (string) => string.substring(0, 3);

describe('Search bar in scenario manager view', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start();
    stub.setScenarios(SCENARIOS);
    stub.setScenarioRuns(SCENARIO_RUNS);
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('can search scenarios by run status and ownerName', () => {
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioAccordions().should('have.length', 6);
    ScenarioManager.writeInFilter('Successful');
    ScenarioManager.getScenarioAccordions().should('have.length', 3);
    ScenarioManager.writeInFilter(getFirstCharacters('Failed'));
    ScenarioManager.getScenarioAccordions().should('have.length', 1);
    ScenarioManager.writeInFilter(getFirstCharacters(USERS_LIST[1].name));
    ScenarioManager.getScenarioAccordions().should('have.length', 4);
    ScenarioManager.writeInFilter('zero filter results');
    ScenarioManager.getScenarioAccordions().should('have.length', 0);
  });

  it('can search scenarios by validation status', () => {
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.writeInFilter(getFirstCharacters('Validated'));
    ScenarioManager.getScenarioAccordions().should('have.length', 2);
    ScenarioManager.writeInFilter(getFirstCharacters('Rejected'));
    ScenarioManager.getScenarioAccordions().should('have.length', 4);
  });

  it('can search scenarios by tags and description', () => {
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.writeInFilter(getFirstCharacters('supply'));
    ScenarioManager.getScenarioAccordions().should('have.length', 4);
    ScenarioManager.writeInFilter(getFirstCharacters('global'));
    ScenarioManager.getScenarioAccordions().should('have.length', 3);
  });

  it('can search scenarios by name, tags and description', () => {
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.writeInFilter(getFirstCharacters('unique'));
    ScenarioManager.getScenarioAccordions().should('have.length', 1);
    ScenarioManager.writeInFilter('supply chain');
    ScenarioManager.getScenarioAccordions().should('have.length', 2);
    ScenarioManager.writeInFilter(getFirstCharacters('Simple'));
    ScenarioManager.getScenarioAccordions().should('have.length', 3);
  });
});
