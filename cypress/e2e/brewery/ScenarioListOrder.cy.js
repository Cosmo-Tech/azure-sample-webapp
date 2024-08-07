// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, ScenarioManager, Scenarios, ScenarioSelector } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { routeUtils as route } from '../../commons/utils';
import { ALL_ROOT_SCENARIOS, PARENT_AND_CHILD_SCENARIOS } from '../../fixtures/stubbing/ScenarioListOrder/scenarios';
import { USER_EXAMPLE } from '../../fixtures/stubbing/default';

describe('check scenario sorted list after reload', () => {
  before(() => {
    stub.start();
    stub.setScenarios(ALL_ROOT_SCENARIOS);
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('checks first scenario in the list after reload', () => {
    ScenarioSelector.selectScenario(ALL_ROOT_SCENARIOS[1].name, ALL_ROOT_SCENARIOS[1].id);
    route.browse({ url: 'W-stbbdbrwry/scenario' });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', ALL_ROOT_SCENARIOS[0].name);
  });
});

describe('check the list of sorted scenarios after deleting the current scenario', () => {
  before(() => {
    stub.start();
    stub.setFakeUser(USER_EXAMPLE);
    stub.setFakeRoles(['Organization.Collaborator']);
    stub.setScenarios(PARENT_AND_CHILD_SCENARIOS);
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('deletes current scenario and checks sorted list', () => {
    ScenarioSelector.getScenarioSelectorInput().should('have.value', PARENT_AND_CHILD_SCENARIOS[0].name);
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.deleteScenario(PARENT_AND_CHILD_SCENARIOS[0].name);
    Scenarios.switchToScenarioView();
    ScenarioSelector.getScenarioSelectorInput().should('have.value', PARENT_AND_CHILD_SCENARIOS[1].name);
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.deleteScenario(PARENT_AND_CHILD_SCENARIOS[1].name);
    Scenarios.switchToScenarioView();
    ScenarioSelector.getScenarioSelectorInput().should('have.value', PARENT_AND_CHILD_SCENARIOS[2].name);
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.deleteScenario(PARENT_AND_CHILD_SCENARIOS[2].name);
  });
});
