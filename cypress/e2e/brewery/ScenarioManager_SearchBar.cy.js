// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { USERS_LIST } from '../../../tests/samples';
import { Login, ScenarioManager } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { setup } from '../../commons/utils';
import { SCENARIOS, SCENARIO_RUNS } from '../../fixtures/stubbing/ScenarioManager_SearchBar/scenarios';

const getFirstCharacters = (string) => string.substring(0, 3);

describe('Search bar in scenario manager view', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start();
    stub.setRunners(SCENARIOS);
    stub.setRunnerRuns(SCENARIO_RUNS);
  });

  beforeEach(() => Login.login());
  after(() => stub.stop());

  it('can search scenarios by name, id, owner name, validation status, tags and description', () => {
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioRows().should('have.length', 6);
    // Try a filter without any match
    ScenarioManager.writeInFilter('zero filter results');
    ScenarioManager.getScenarioRows().should('have.length', 0);
    // Search by scenario name (with wrong case)
    ScenarioManager.writeInFilter(getFirstCharacters('simple'));
    ScenarioManager.getScenarioRows().should('have.length', 3);
    // Search by run status
    ScenarioManager.writeInFilter('Successful');
    ScenarioManager.getScenarioRows().should('have.length', 3);
    ScenarioManager.writeInFilter(getFirstCharacters('Failed'));
    ScenarioManager.getScenarioRows().should('have.length', 1);
    // Search by scenario id
    ScenarioManager.writeInFilter(SCENARIOS[0].id);
    ScenarioManager.getScenarioRows().should('have.length', 1);
    // Search by user name
    ScenarioManager.writeInFilter(getFirstCharacters(USERS_LIST[1].name));
    ScenarioManager.getScenarioRows().should('have.length', 4);
    // Search by validation status
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.writeInFilter(getFirstCharacters('Validated'));
    ScenarioManager.getScenarioRows().should('have.length', 2);
    ScenarioManager.writeInFilter(getFirstCharacters('Rejected'));
    ScenarioManager.getScenarioRows().should('have.length', 4);
    // Search by tags & description
    ScenarioManager.writeInFilter(getFirstCharacters('supply'));
    ScenarioManager.getScenarioRows().should('have.length', 4);
    ScenarioManager.writeInFilter(getFirstCharacters('global'));
    ScenarioManager.getScenarioRows().should('have.length', 3);
    ScenarioManager.writeInFilter(getFirstCharacters('unique'));
    ScenarioManager.getScenarioRows().should('have.length', 1);
    ScenarioManager.writeInFilter('supply chain');
    ScenarioManager.getScenarioRows().should('have.length', 2);
    ScenarioManager.writeInFilter(getFirstCharacters('Simple'));
    ScenarioManager.getScenarioRows().should('have.length', 3);
  });
});
