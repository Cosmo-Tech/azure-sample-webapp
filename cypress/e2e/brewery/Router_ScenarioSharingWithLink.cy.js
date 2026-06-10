// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import rfdc from 'rfdc';
import { Login, ScenarioSelector } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { routeUtils as route } from '../../commons/utils';
import { DEFAULT_SIMULATION_RUNNER, WORKSPACE_WITH_INSTANCE_VIEW } from '../../fixtures/stubbing/default';

const clone = rfdc();

const SCENARIO_A = clone(DEFAULT_SIMULATION_RUNNER);
const SCENARIO_B = clone(DEFAULT_SIMULATION_RUNNER);
SCENARIO_A.id = 'r-scenarioA';
SCENARIO_B.id = 'r-scenarioB';
SCENARIO_A.name = 'Scenario A'; // Initialize scenarios in alphabetical order for scenario selector
SCENARIO_B.name = 'Scenario B';

describe('Scenario sharing with a link', () => {
  before(() => {
    stub.start();
    stub.setRunners([SCENARIO_A, SCENARIO_B]);
    stub.setWorkspaces([WORKSPACE_WITH_INSTANCE_VIEW]);
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('shares the scenario with a link to Scenario view', () => {
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO_A.name);
    route.browse({
      url: `${WORKSPACE_WITH_INSTANCE_VIEW.id}/scenario/${SCENARIO_B.id}`,
      workspaceId: WORKSPACE_WITH_INSTANCE_VIEW.id,
      scenarioId: SCENARIO_B.id,
      expectedURL: 'scenario',
    });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO_B.name);
  });

  it('shares the scenario with a link to Instance view', () => {
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO_A.name);
    route.browse({
      url: `${WORKSPACE_WITH_INSTANCE_VIEW.id}/instance/${SCENARIO_B.id}`,
      workspaceId: WORKSPACE_WITH_INSTANCE_VIEW.id,
      scenarioId: SCENARIO_B.id,
      expectedURL: 'instance',
    });
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO_B.name);
  });
});
