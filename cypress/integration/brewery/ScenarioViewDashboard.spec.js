// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import utils from '../../commons/TestUtils';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { Scenarios, ScenarioManager, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters, Login as BreweryLogin } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { setup } from '../../commons/utils/setup';

const SCENARIO_DATASET = DATASET.BREWERY_ADT;
const SCENARIO_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;

describe('Scenario view PowerBI report', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
      GET_SOLUTIONS: true,
    });
    BreweryLogin.login();
  });

  beforeEach(() => {
    BreweryLogin.relogin();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    ScenarioManager.deleteScenarioList(scenarioNamesToDelete);
  });

  it('can correctly show "out of sync" dashboard warning', () => {
    const prefix = 'Test Cypress - Scenario view dashboard - ';
    const randomString = utils.randomStr(7);
    const scenarioName = prefix + randomString;
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE).then((value) => {
      scenarioNamesToDelete.push(scenarioName);

      // First phase: warning is never visible until we first launch the scenario
      Scenarios.checkIfReportIsUnsynced(false);
      ScenarioParameters.edit();
      BreweryParameters.getCurrencyUsedInput().check();
      Scenarios.checkIfReportIsUnsynced(false);

      // Second phase: after a run, warning is only visible when the form is in a "dirty" state
      ScenarioParameters.updateAndLaunch();
      Scenarios.checkIfReportIsUnsynced(false);
      // TODO: add stubbing for scenario runs
      ScenarioParameters.getParametersEditButton(120).should('not.be.disabled'); // Wait for end of run
      Scenarios.checkIfReportIsUnsynced(false);
      ScenarioParameters.edit();
      BreweryParameters.getCurrencyUsedInput().uncheck();
      Scenarios.checkIfReportIsUnsynced(true);
      BreweryParameters.getCurrencyUsedInput().check();
      Scenarios.checkIfReportIsUnsynced(false);
      BreweryParameters.getCurrencyUsedInput().uncheck();
      Scenarios.checkIfReportIsUnsynced(true);
      ScenarioParameters.discard();
      Scenarios.checkIfReportIsUnsynced(false);
      ScenarioParameters.edit();
      BreweryParameters.getCurrencyUsedInput().uncheck();
      Scenarios.checkIfReportIsUnsynced(true);
      ScenarioParameters.updateAndLaunch();
      Scenarios.checkIfReportIsUnsynced(false);

      // TODO: when "update & launch" button has been split, add steps to check that the warning is still visible after
      // saving new parameters values, even if we "undo" local changes or discard them, until the scenario is run
    });
  });
});
