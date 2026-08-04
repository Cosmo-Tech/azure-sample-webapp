// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, ScenarioManager, ScenarioParameters, Scenarios } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { DEFAULT_RUNNER_BASE_DATASET, BASIC_PARAMETERS_SIMULATION_RUNNER } from '../../fixtures/stubbing/default';

const _formatDate = (date) => new Date(date).toLocaleString();

describe('Scenario manager', () => {
  before(() => {
    stub.start();
    stub.setRunners([BASIC_PARAMETERS_SIMULATION_RUNNER]);
  });

  beforeEach(() => Login.login());
  after(() => stub.stop());

  it('must display scenario metadata in the scenario manager', () => {
    const scenarioId = BASIC_PARAMETERS_SIMULATION_RUNNER.id;
    const scenarioName = BASIC_PARAMETERS_SIMULATION_RUNNER.name;
    const scenarioOwnerName = BASIC_PARAMETERS_SIMULATION_RUNNER.additionalData.webapp.ownerName;
    const scenarioCreationDate = BASIC_PARAMETERS_SIMULATION_RUNNER.createInfo.timestamp;
    const scenarioRunTemplate = BASIC_PARAMETERS_SIMULATION_RUNNER.runTemplateName;
    const runOptions = { runDuration: 500, finalStatus: 'Successful', expectedPollsCount: 2 };

    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioName(scenarioId).should('have.text', scenarioName);
    ScenarioManager.getScenarioOwnerName(scenarioId).should('have.text', scenarioOwnerName);
    ScenarioManager.getScenarioCreationDate(scenarioId).should('have.text', _formatDate(scenarioCreationDate));
    ScenarioManager.getScenarioRunTemplate(scenarioId).should('have.text', scenarioRunTemplate);
    ScenarioManager.getScenarioRunStatus(scenarioId).should('have.text', 'Created');
    ScenarioManager.getScenarioDataset(scenarioId).should('have.text', DEFAULT_RUNNER_BASE_DATASET.name);
    ScenarioManager.checkScenarioValidationStatus(scenarioId, 'Draft');

    Scenarios.switchToScenarioView();
    ScenarioParameters.launch({ scenarioId, runOptions, saveAndLaunch: true });
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioRunStatus(scenarioId).should('have.text', 'Running');
    ScenarioManager.getScenarioRunStatus(scenarioId, 15).should('have.text', 'Successful');
  });
});
