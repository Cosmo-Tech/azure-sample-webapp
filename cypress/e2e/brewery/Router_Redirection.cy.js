// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, ScenarioManager, Scenarios, ScenarioSelector } from '../../commons/actions';
import { PAGE_NAME } from '../../commons/constants/generic/TestConstants';
import { stub } from '../../commons/services/stubbing';
import { DEFAULT_RUNNERS } from '../../fixtures/stubbing/default';

describe('Redirects to right page', () => {
  before(() => {
    stub.start();
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
    ScenarioManager.openScenarioFromScenarioManager(DEFAULT_RUNNERS[3].id);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_RUNNERS[3].name);
  });
});
