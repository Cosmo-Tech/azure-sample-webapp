// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import rfdc from 'rfdc';
import { Login, Scenarios, ScenarioManager, ScenarioParameters } from '../../commons/actions';
import { ScenarioSelector } from '../../commons/actions/generic/ScenarioSelector';
import { stub } from '../../commons/services/stubbing';
import { BASIC_PARAMETERS_SIMULATION_RUNNER } from '../../fixtures/stubbing/default';

const clone = rfdc();

const SCENARIO_A = BASIC_PARAMETERS_SIMULATION_RUNNER;
const SCENARIO_B = clone(BASIC_PARAMETERS_SIMULATION_RUNNER);
SCENARIO_A.id = 'r-scenarioA';
SCENARIO_B.id = 'r-scenarioB';
SCENARIO_A.name = 'Cypress Scenario A';
SCENARIO_B.name = 'Cypress Scenario B';

const SCENARIO_A_ID = SCENARIO_A.id;
const SCENARIO_B_ID = SCENARIO_B.id;
const SCENARIO_NAME_A1 = SCENARIO_A.name;
const SCENARIO_NAME_A2 = SCENARIO_A.name + '_renamed';
const SCENARIO_NAME_A3 = SCENARIO_A.name + '_renamed_again';
const SCENARIO_NAME_B1 = SCENARIO_B.name;

describe('Create scenario and rename it', () => {
  before(() => {
    stub.start();
  });

  beforeEach(() => {
    stub.setRunners([SCENARIO_A, SCENARIO_B]);
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('Rename scenario several times and launch', () => {
    ScenarioManager.switchToScenarioManager();

    // Start editing name and cancel edition
    ScenarioManager.getRenameScenarioButton(SCENARIO_A_ID).click();
    ScenarioManager.getScenarioEditableLink(SCENARIO_A_ID).type('{selectAll}{backspace}' + SCENARIO_NAME_A2 + '{esc}');
    ScenarioManager.getScenarioEditableLink(SCENARIO_A_ID).should('have.text', SCENARIO_NAME_A1);

    // Actually rename the scenario
    ScenarioManager.renameScenario(SCENARIO_A_ID, SCENARIO_NAME_A2);
    ScenarioManager.getScenarioEditableLink(SCENARIO_A_ID).should('have.text', SCENARIO_NAME_A2);
    Scenarios.switchToScenarioView();
    ScenarioSelector.selectScenario(SCENARIO_NAME_B1, SCENARIO_B_ID);
    ScenarioSelector.selectScenario(SCENARIO_NAME_A2, SCENARIO_A_ID); // Click on renamed scenario in selector

    // Rename scenario again
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioAccordion(SCENARIO_A_ID).click();
    ScenarioManager.renameScenario(SCENARIO_A_ID, SCENARIO_NAME_A3);
    ScenarioManager.getScenarioEditableLink(SCENARIO_A_ID).should('have.text', SCENARIO_NAME_A3);
    ScenarioManager.getScenarioViewRedirect(SCENARIO_A_ID).click();
    ScenarioSelector.selectScenario(SCENARIO_NAME_B1, SCENARIO_B_ID);
    ScenarioSelector.selectScenario(SCENARIO_NAME_A3, SCENARIO_A_ID);

    ScenarioParameters.launch();
  });

  it('Rename two scenarios, setting the second with the former name of the first one', () => {
    ScenarioManager.switchToScenarioManager();

    ScenarioManager.getScenarioEditableLink(SCENARIO_A_ID).should('have.text', SCENARIO_NAME_A1);
    ScenarioManager.renameScenario(SCENARIO_A_ID, SCENARIO_NAME_A2);
    ScenarioManager.getScenarioEditableLink(SCENARIO_A_ID).should('have.text', SCENARIO_NAME_A2);
    ScenarioManager.renameScenario(SCENARIO_B_ID, SCENARIO_NAME_A1);
    ScenarioManager.getScenarioEditableLink(SCENARIO_B_ID).should('have.text', SCENARIO_NAME_A1);

    ScenarioManager.getScenarioViewRedirect(SCENARIO_B_ID).click();
    ScenarioSelector.selectScenario(SCENARIO_NAME_A2, SCENARIO_A_ID);
    ScenarioSelector.selectScenario(SCENARIO_NAME_A1, SCENARIO_B_ID);
  });
});
