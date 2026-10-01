// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, Scenarios, ScenarioSelector } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { DEFAULT_SIMULATION_RUNNER } from '../../fixtures/stubbing/default';

const STATUSES = ['NotStarted', 'Running', 'Successful', 'Failed', 'Unknown'];

const RUNNERS = STATUSES.map((status, index) => ({
  ...DEFAULT_SIMULATION_RUNNER,
  id: `r-runstatechip${index}`,
  name: `Cypress - Run state chip - ${status}`,
  parentId: null,
  rootId: null,
  lastRunInfo: {
    lastRunId: status === 'NotStarted' ? null : `run-runstatechip${index}`,
    lastRunStatus: status,
  },
}));

describe('Scenario run state chip', () => {
  before(() => stub.start());
  beforeEach(() => {
    stub.setRunners(RUNNERS);
    Login.login();
  });
  afterEach(() => stub.reset());
  after(() => stub.stop());

  it('displays the run state chip matching the last run status of each scenario', () => {
    RUNNERS.forEach((runner) => {
      ScenarioSelector.selectScenario(runner.name, runner.id);
      Scenarios.getScenarioRunStateChip(runner.id, runner.lastRunInfo.lastRunStatus).should('be.visible');
    });
  });
});
