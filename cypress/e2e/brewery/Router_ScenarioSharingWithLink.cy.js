// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, ScenarioSelector } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { routeUtils as route } from '../../commons/utils';
import { DEFAULT_SCENARIOS_LIST, WORKSPACE_WITH_INSTANCE_VIEW } from '../../fixtures/stubbing/default';

describe('Scenario sharing with a link', () => {
  before(() => {
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
      GET_WORKSPACES: true,
      GET_ORGANIZATION: true,
      GET_SOLUTIONS: true,
    });
    stub.setWorkspaces([WORKSPACE_WITH_INSTANCE_VIEW]);
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('shares the scenario with a link to Scenario view', () => {
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);
    route.browse({
      url: `${WORKSPACE_WITH_INSTANCE_VIEW.id}/scenario/${DEFAULT_SCENARIOS_LIST[3].id}`,
      workspaceId: WORKSPACE_WITH_INSTANCE_VIEW.id,
      scenarioId: DEFAULT_SCENARIOS_LIST[3].id,
      expectedURL: 'scenario',
    });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);
  });

  it('shares the scenario with a link to Instance view', () => {
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);
    route.browse({
      url: `${WORKSPACE_WITH_INSTANCE_VIEW.id}/instance/${DEFAULT_SCENARIOS_LIST[3].id}`,
      workspaceId: WORKSPACE_WITH_INSTANCE_VIEW.id,
      scenarioId: DEFAULT_SCENARIOS_LIST[3].id,
      expectedURL: 'instance',
    });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[3].name);
  });
});
