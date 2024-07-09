// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { Scenarios, ScenarioManager, ScenarioParameters } from '../../commons/actions';
import { Login } from '../../commons/actions/brewery';
import { ScenarioSelector } from '../../commons/actions/generic/ScenarioSelector';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';

describe('Create scenario and rename it', () => {
  Cypress.Keyboard.defaults({
    keystrokeDelay: 0,
  });

  const SCENARIO_DATASET = DATASET.BREWERY_ADT;
  const SCENARIO_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;

  function forgeScenarioName() {
    const prefix = 'Scenario to rename - ';
    const randomString = utils.randomStr(7);
    return prefix + randomString;
  }

  const anotherScenario = forgeScenarioName();
  let anotherScenarioId;
  const scenarioNamesToDelete = [];
  scenarioNamesToDelete.push(anotherScenario);

  before(() => {
    Login.login();
    Scenarios.createScenario(anotherScenario, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE).then((data) => {
      anotherScenarioId = data.scenarioCreatedId;
    });
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    ScenarioManager.deleteScenarioList(scenarioNamesToDelete);
  });

  it('Rename scenarios several times and launch', () => {
    const scenarioNamePrefix = forgeScenarioName();
    const scenarioName = scenarioNamePrefix + '_A';
    let newScenarioName = scenarioNamePrefix + '_B';

    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE).then((data) => {
      const scenarioId = data.scenarioCreatedId;
      ScenarioManager.switchToScenarioManager();
      ScenarioManager.getRenameScenarioButton(scenarioId).click();
      ScenarioManager.getScenarioEditableLink(scenarioId, 15)
        .type('{selectAll}{backspace}' + newScenarioName + '{esc}') // Do not confirm new name
        .should('have.text', scenarioName);
      ScenarioManager.renameScenario(scenarioId, newScenarioName);
      ScenarioManager.getScenarioEditableLink(scenarioId, 15).should('have.text', newScenarioName);
      Scenarios.switchToScenarioView();
      ScenarioSelector.selectScenario(anotherScenario, anotherScenarioId);
      ScenarioSelector.selectScenario(newScenarioName, scenarioId);

      newScenarioName = scenarioNamePrefix + '_C';
      scenarioNamesToDelete.push(newScenarioName);

      ScenarioManager.switchToScenarioManager();
      ScenarioManager.getScenarioAccordion(scenarioId).click();
      ScenarioManager.renameScenario(scenarioId, newScenarioName);
      ScenarioManager.getScenarioEditableLink(scenarioId, 15).should('have.text', newScenarioName);
      ScenarioManager.getScenarioViewRedirect(scenarioId).click();
      ScenarioSelector.selectScenario(anotherScenario, anotherScenarioId);
      ScenarioSelector.selectScenario(newScenarioName, scenarioId);
    });

    ScenarioParameters.launch();
  });

  it('Rename two scenarios, setting the second with the former name of the first one', () => {
    const scenarioNamePrefix = forgeScenarioName();
    const scenarioName1A = scenarioNamePrefix + '_1A';
    const scenarioName2A = scenarioNamePrefix + '_2A';
    const scenarioName1B = scenarioNamePrefix + '_1B';

    scenarioNamesToDelete.push(scenarioName1B, scenarioName1A);

    Scenarios.createScenario(scenarioName1A, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE).then((data) => {
      const scenarioID1 = data.scenarioCreatedId;
      Scenarios.createScenario(scenarioName2A, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE).then((data) => {
        const scenarioID2 = data.scenarioCreatedId;
        ScenarioManager.switchToScenarioManager();

        ScenarioManager.renameScenario(scenarioID1, scenarioName1B);
        ScenarioManager.getScenarioEditableLink(scenarioID1, 15).should('have.text', scenarioName1B);
        ScenarioManager.renameScenario(scenarioID2, scenarioName1A);
        ScenarioManager.getScenarioEditableLink(scenarioID2, 15).should('have.text', scenarioName1A);

        ScenarioManager.getScenarioViewRedirect(scenarioID2).click();
        ScenarioSelector.selectScenario(anotherScenario, anotherScenarioId);
        ScenarioSelector.selectScenario(scenarioName1B, scenarioID1);
        ScenarioSelector.selectScenario(scenarioName1A, scenarioID2);
      });
    });

    ScenarioParameters.launch();
  });
});
