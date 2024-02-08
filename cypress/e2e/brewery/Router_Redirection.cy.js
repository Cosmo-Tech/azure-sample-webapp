// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, ScenarioManager, Scenarios, ScenarioSelector } from '../../commons/actions';
import { PAGE_NAME } from '../../commons/constants/generic/TestConstants';
import { stub } from '../../commons/services/stubbing';
import { DEFAULT_SCENARIOS_LIST } from '../../fixtures/stubbing/default';

describe('Redirects to right page', () => {
  before(() => {
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
      GET_WORKSPACES: true,
      GET_ORGANIZATION: true,
      GET_SOLUTIONS: true,
    });
  });

  after(() => {
    stub.stop();
  });

  it('redirects to scenario manager view after login', () => {
    Login.login({ url: `W-stbbdbrwry${PAGE_NAME.SCENARIO_MANAGER}` });
    ScenarioManager.getScenarioManagerView().should('be.visible');
  });

  it('redirects from scenario manager to scenario view with chosen scenario as current', () => {
    Login.login();
    Scenarios.getScenarioView().should('be.visible');
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.openScenarioFromScenarioManager(DEFAULT_SCENARIOS_LIST[3].id);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);
  });
});
