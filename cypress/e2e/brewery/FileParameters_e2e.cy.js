// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { Downloads, Scenarios, ScenarioManager, ScenarioParameters, ScenarioSelector } from '../../commons/actions';
import { BreweryParameters, Login } from '../../commons/actions/brewery';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { EXPECTED_DATA_AFTER_DUMMY_DATASET_1_UPLOAD } from '../../fixtures/FileParametersData';

const SCENARIO_DATASET = DATASET.BREWERY_STORAGE;
const BASIC_TYPES_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;
const FILE_PATH_1 = 'dummy_dataset_1.csv';
const FILE_PATH_2 = 'dummy_dataset_2.csv';

const SCENARIO_NAME_PREFIX = `CypressFileParams_${utils.randomStr(7)}`;
const SCENARIO_NAME_S1 = `${SCENARIO_NAME_PREFIX} - S1`;
const SCENARIO_NAME_S2 = `${SCENARIO_NAME_PREFIX} - S2`;
const SCENARIO_NAME_S3 = `${SCENARIO_NAME_PREFIX} - S3`;
let idOfScenarioS1;

// This test is an end-to-end test, chaining 3 test "it" blocks to perform these checks:
// 1. Create "Scenario S1", check that we can upload multiple files at once, even in different parameter tabs
// 2. Create "Scenario S2" based on S1, check that we can inherit a file in a child scenario, and delete the inherited
// file without impacting the parent scenario
// 3. Create "Scenario S3" based on S2, check it does not inherit from a file that has been deleted

describe('File parameters (end-to-end test)', { keystrokeDelay: 1 }, () => {
  beforeEach(() => {
    Login.login();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    ScenarioManager.deleteScenarioList(scenarioNamesToDelete);
  });

  it('can upload multiple files at once, even in different parameter tabs', () => {
    // Create scenario & wait for scenario creation
    Scenarios.createScenario(SCENARIO_NAME_S1, true, SCENARIO_DATASET, BASIC_TYPES_RUN_TEMPLATE).then((value) => {
      idOfScenarioS1 = value.scenarioCreatedId;
      scenarioNamesToDelete.push(SCENARIO_NAME_S1);
      ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO_NAME_S1);

      // Upload files & save
      BreweryParameters.switchToDatasetPartsTab();
      BreweryParameters.uploadExampleDatasetPart1(FILE_PATH_1);
      BreweryParameters.uploadExampleDatasetPart2(FILE_PATH_2);
      BreweryParameters.switchToExtraDatasetPartTab();
      BreweryParameters.uploadExampleDatasetPart3(FILE_PATH_1);
      ScenarioParameters.save();

      // Check file parameters after saving
      BreweryParameters.getExampleDatasetPart3DownloadButton().should('have.text', FILE_PATH_1);
      BreweryParameters.switchToDatasetPartsTab();
      BreweryParameters.getExampleDatasetPart1DownloadButton().should('have.text', FILE_PATH_1);
      BreweryParameters.getExampleDatasetPart2DownloadButton().should('have.text', FILE_PATH_2);
      // Check file content
      BreweryParameters.downloadExampleDatasetPart1();
      Downloads.checkByContent(FILE_PATH_1, EXPECTED_DATA_AFTER_DUMMY_DATASET_1_UPLOAD);

      // A webapp bug causes the form to become dirty when a file is downloaded
      // Remove the line below when the bug is fixed
      ScenarioParameters.discard();
    });
  });

  it('can inherit a file in a child scenario, and delete this file without impacting the parent scenario', () => {
    // Create scenario & wait for scenario creation
    Scenarios.createScenario(SCENARIO_NAME_S2, false, SCENARIO_NAME_S1, BASIC_TYPES_RUN_TEMPLATE).then((value) => {
      scenarioNamesToDelete.push(SCENARIO_NAME_S2);
      ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO_NAME_S2);

      // Check that files have been inhertied from the parent scenrtio
      BreweryParameters.switchToDatasetPartsTab();
      BreweryParameters.getExampleDatasetPart1DownloadButton().should('have.text', FILE_PATH_1);
      BreweryParameters.getExampleDatasetPart2DownloadButton().should('have.text', FILE_PATH_2);
      BreweryParameters.switchToExtraDatasetPartTab();
      BreweryParameters.getExampleDatasetPart3DownloadButton().should('have.text', FILE_PATH_1);
      // Check file content
      BreweryParameters.switchToDatasetPartsTab();
      BreweryParameters.downloadExampleDatasetPart1();
      Downloads.checkByContent(FILE_PATH_1, EXPECTED_DATA_AFTER_DUMMY_DATASET_1_UPLOAD);

      // Delete file in child scenario & save
      BreweryParameters.deleteExampleDatasetPart1();
      ScenarioParameters.save();
      BreweryParameters.getExampleDatasetPart1DownloadButton().should('not.exist');

      // Check that the deleted file still exists in the parent scenario
      ScenarioSelector.selectScenario(SCENARIO_NAME_S1, idOfScenarioS1);
      BreweryParameters.switchToDatasetPartsTab();
      BreweryParameters.getExampleDatasetPart1DownloadButton().should('have.text', FILE_PATH_1);
    });
  });

  it('does not inherit from a file that has been deleted in the parent scenario', () => {
    // Create scenario & wait for scenario creation
    Scenarios.createScenario(SCENARIO_NAME_S3, false, SCENARIO_NAME_S2, BASIC_TYPES_RUN_TEMPLATE).then((value) => {
      scenarioNamesToDelete.push(SCENARIO_NAME_S3);
      ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIO_NAME_S3);

      // Check that deleted file has not been inherited
      BreweryParameters.switchToDatasetPartsTab();
      BreweryParameters.getExampleDatasetPart1DownloadButton().should('not.exist');
    });
  });
});
