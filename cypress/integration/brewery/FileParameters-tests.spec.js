// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import 'cypress-file-upload';
import utils from '../../commons/TestUtils';

import { SCENARIO_NAME, DATASET, SCENARIO_TYPE } from '../../commons/constants/brewery/TestConstants';
import { PAGE_NAME } from '../../commons/constants/generic/TestConstants';
import { Scenarios, ScenarioManager, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});

const SCENARIO_DATASET = DATASET.BREWERY_ADT;
const SCENARIO_RUN_TYPE = SCENARIO_TYPE.BASIC_TYPES;
const FILE_PATH_1 = 'dummy_dataset_1.csv';
const FILE_PATH_2 = 'dummy_dataset_2.csv';

function forgeScenarioName() {
  return `${SCENARIO_NAME.SCENARIO_WITH_FILES}${utils.randomStr(7)}`;
}

describe('Simple operations on a file parameter', () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.relogin();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    // Delete all tests scenarios
    ScenarioManager.switchToScenarioManager();
    for (const scenarioName of scenarioNamesToDelete) {
      ScenarioManager.deleteScenario(scenarioName);
    }
  });

  let firstScenarioName;
  let firstScenarioId;
  it('can upload a file and run the scenario', () => {
    firstScenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(firstScenarioName);
    cy.createScenario(firstScenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TYPE).then((value) => {
      firstScenarioId = value.scenarioCreatedId;
    });
    ScenarioParameters.edit();
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.uploadExampleDatasetPart1(FILE_PATH_1);
    ScenarioParameters.updateAndLaunch();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('have.text', FILE_PATH_1);
  });

  it('can upload a file, delete it and run the scenario', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    cy.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TYPE);
    ScenarioParameters.edit();
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('not.exist');
    BreweryParameters.uploadExampleDatasetPart1(FILE_PATH_1);
    BreweryParameters.deleteExampleDatasetPart1();
    ScenarioParameters.updateAndLaunch();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('not.exist');
  });

  it('can upload a file, discard all modifications and run the scenario', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    cy.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TYPE);
    ScenarioParameters.edit();
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.uploadExampleDatasetPart1(FILE_PATH_1);
    ScenarioParameters.discard();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('not.exist');
  });

  it('can delete an uploaded file and run the scenario', () => {
    Scenarios.select(firstScenarioName, firstScenarioId); // Expecting the first scenario to be done by then
    ScenarioParameters.edit();
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('have.text', FILE_PATH_1);
    BreweryParameters.deleteExampleDatasetPart1();
    ScenarioParameters.updateAndLaunch();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('not.exist');
  });
});

describe('Simple operations on a file parameter in a parameters tab that lost focus', () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.relogin();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    // Delete all tests scenarios
    ScenarioManager.switchToScenarioManager();
    for (const scenarioName of scenarioNamesToDelete) {
      ScenarioManager.deleteScenario(scenarioName);
    }
  });

  let firstScenarioName;
  let firstScenarioId;
  it('can upload a file and run the scenario', () => {
    firstScenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(firstScenarioName);
    cy.createScenario(firstScenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TYPE).then((value) => {
      firstScenarioId = value.scenarioCreatedId;
    });
    ScenarioParameters.edit();
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.uploadExampleDatasetPart3(FILE_PATH_1);
    BreweryParameters.switchToDatasetPartsTab();
    ScenarioParameters.updateAndLaunch();
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.getExampleDatasetPart3DownloadButton().should('have.text', FILE_PATH_1);
  });

  it('can upload a file, delete it and run the scenario', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    cy.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TYPE);
    ScenarioParameters.edit();
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.getExampleDatasetPart3DownloadButton().should('not.exist');
    BreweryParameters.uploadExampleDatasetPart3(FILE_PATH_1);
    BreweryParameters.deleteExampleDatasetPart3();
    BreweryParameters.switchToDatasetPartsTab();
    ScenarioParameters.updateAndLaunch();
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.getExampleDatasetPart3DownloadButton().should('not.exist');
  });

  it('can upload a file, discard all modifications and run the scenario', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    cy.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TYPE);
    ScenarioParameters.edit();
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.uploadExampleDatasetPart3(FILE_PATH_1);
    BreweryParameters.switchToDatasetPartsTab();
    ScenarioParameters.discard();
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.getExampleDatasetPart3DownloadButton().should('not.exist');
  });

  it('can delete an uploaded file and run the scenario', () => {
    Scenarios.select(firstScenarioName, firstScenarioId); // Expecting the first scenario to be done by then
    ScenarioParameters.edit();
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.getExampleDatasetPart3DownloadButton().should('have.text', FILE_PATH_1);
    BreweryParameters.deleteExampleDatasetPart3();
    BreweryParameters.switchToDatasetPartsTab();
    ScenarioParameters.updateAndLaunch();
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.getExampleDatasetPart3DownloadButton().should('not.exist');
  });
});

describe('Scenario inheritance for file parameters', () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.relogin();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    // Delete all tests scenarios
    ScenarioManager.switchToScenarioManager();
    for (const scenarioName of scenarioNamesToDelete) {
      ScenarioManager.deleteScenario(scenarioName);
    }
  });

  const scenarioPrefix = forgeScenarioName();
  const grandParentScenarioName = scenarioPrefix + ' - GrandParent';
  const parentScenarioName = scenarioPrefix + ' - Parent';
  const childScenarioName = scenarioPrefix + ' - Child';
  scenarioNamesToDelete.push(grandParentScenarioName);
  scenarioNamesToDelete.push(parentScenarioName);
  scenarioNamesToDelete.push(childScenarioName);

  let grandParentScenarioId;
  let parentScenarioId;

  it('can create a scenario, upload a file, create a child scenario and run it', () => {
    cy.createScenario(grandParentScenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TYPE).then((value) => {
      grandParentScenarioId = value.scenarioCreatedId;
    });
    ScenarioParameters.edit();
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.uploadExampleDatasetPart1(FILE_PATH_1);
    ScenarioParameters.updateAndLaunch();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('have.text', FILE_PATH_1);

    cy.createScenario(parentScenarioName, false, grandParentScenarioName, SCENARIO_RUN_TYPE).then((value) => {
      parentScenarioId = value.scenarioCreatedId;
    });
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('have.text', FILE_PATH_1);
  });

  it('can create a scenario, upload a file, create a child scenario, delete the file and run it', () => {
    Scenarios.select(parentScenarioName, parentScenarioId);
    ScenarioParameters.edit();
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('have.text', FILE_PATH_1);
    BreweryParameters.deleteExampleDatasetPart1();
    ScenarioParameters.updateAndLaunch();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('not.exist');

    Scenarios.select(grandParentScenarioName, grandParentScenarioId);
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('have.text', FILE_PATH_1);
  });

  it(
    'can create a scenario, upload a file, create a child scenario, delete the file, create a child scenario for ' +
      'the first child scenario and run it',
    () => {
      cy.createScenario(childScenarioName, false, parentScenarioName, SCENARIO_RUN_TYPE);
      BreweryParameters.switchToDatasetPartsTab();
      BreweryParameters.getExampleDatasetPart1DownloadButton().should('not.exist');
    }
  );
});

describe('File parameters in multiple tabs', () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.relogin();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    // Delete all tests scenarios
    ScenarioManager.switchToScenarioManager();
    for (const scenarioName of scenarioNamesToDelete) {
      ScenarioManager.deleteScenario(scenarioName);
    }
  });

  it('can create a scenario and upload several files, in several tabs', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    cy.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TYPE);
    ScenarioParameters.edit();
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.uploadExampleDatasetPart1(FILE_PATH_1);
    BreweryParameters.uploadExampleDatasetPart2(FILE_PATH_2);
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.uploadExampleDatasetPart3(FILE_PATH_1);
    ScenarioParameters.updateAndLaunch();

    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('have.text', FILE_PATH_1);
    BreweryParameters.getExampleDatasetPart2DownloadButton().should('have.text', FILE_PATH_2);
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.getExampleDatasetPart3DownloadButton().should('have.text', FILE_PATH_1);
  });
});
