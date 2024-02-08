// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { Downloads, Scenarios, ScenarioManager, ScenarioParameters, ScenarioSelector } from '../../commons/actions';
import { BreweryParameters, Login } from '../../commons/actions/brewery';
import {
  BASIC_PARAMETERS_CONST,
  BREWERY_WORKSPACE_ID,
  DATASET,
  RUN_TEMPLATE,
} from '../../commons/constants/brewery/TestConstants';
import { routeUtils as route } from '../../commons/utils';
import { EXPECTED_DATA_AFTER_DUMMY_DATASET_1_UPLOAD } from '../../fixtures/FileParametersData';

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});

const SCENARIO_DATASET = DATASET.BREWERY_ADT;
const BASIC_TYPES_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;
const BREWERY_RUN_TEMPLATE = RUN_TEMPLATE.BREWERY_PARAMETERS;
const FILE_PATH_1 = 'dummy_dataset_1.csv';
const FILE_PATH_2 = 'dummy_dataset_2.csv';

function forgeScenarioName() {
  return `Test Cypress - File parameters - ${utils.randomStr(7)}`;
}

describe('Simple operations on a file parameter', () => {
  beforeEach(() => {
    Login.login();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    Downloads.clearDownloadsFolder();
    ScenarioManager.deleteScenarioList(scenarioNamesToDelete);
  });

  let firstScenarioName;
  let firstScenarioId;
  it('can upload a file, save it and download the uploaded file', () => {
    const currency = utils.randomEnum(BASIC_PARAMETERS_CONST.ENUM_KEYS);
    const currencyName = utils.randomStr(8);
    const currencyValue = utils.randomNmbr(BASIC_PARAMETERS_CONST.NUMBER.MIN, BASIC_PARAMETERS_CONST.NUMBER.MAX);
    firstScenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(firstScenarioName);
    Scenarios.createScenario(firstScenarioName, true, SCENARIO_DATASET, BASIC_TYPES_RUN_TEMPLATE).then((value) => {
      firstScenarioId = value.scenarioCreatedId;
    });

    BreweryParameters.switchToBasicTypesTab();
    BreweryParameters.getCurrencyNameInput().click().clear().type(currencyName);
    BreweryParameters.getCurrencyValueInput().click().clear().type(currencyValue);
    BreweryParameters.getCurrencySelectOption(currency);
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.uploadExampleDatasetPart1(FILE_PATH_1);

    ScenarioParameters.save();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('have.text', FILE_PATH_1);
    BreweryParameters.downloadExampleDatasetPart1();
    Downloads.checkByContent('dummy_dataset_1.csv', EXPECTED_DATA_AFTER_DUMMY_DATASET_1_UPLOAD);
    BreweryParameters.switchToBasicTypesTab();
    BreweryParameters.getCurrencyNameInput().should('value', currencyName);
    BreweryParameters.getCurrencyValueInput().should('value', currencyValue);
    BreweryParameters.getCurrencyInput().should('value', currency);
  });

  it('can undo or discard changes after a file upload', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, BASIC_TYPES_RUN_TEMPLATE);
    BreweryParameters.switchToDatasetPartsTab();
    // Upload & discard
    BreweryParameters.uploadExampleDatasetPart1(FILE_PATH_1);
    ScenarioParameters.discard();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('not.exist');
    BreweryParameters.getExampleDatasetPart1FileName().should('not.exist');
    ScenarioParameters.getSaveButton().should('not.exist');
    // Upload & delete before saving
    BreweryParameters.uploadExampleDatasetPart1(FILE_PATH_1);
    BreweryParameters.deleteExampleDatasetPart1();
    ScenarioParameters.getSaveButton().should('not.exist');
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('not.exist');
    BreweryParameters.getExampleDatasetPart1FileName().should('not.exist');
  });

  it('can upload a file twice', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, BASIC_TYPES_RUN_TEMPLATE);
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.uploadExampleDatasetPart1(FILE_PATH_1);
    BreweryParameters.getExampleDatasetPart1FileName().should('have.text', FILE_PATH_1);
    BreweryParameters.deleteExampleDatasetPart1();
    BreweryParameters.getExampleDatasetPart1FileName().should('not.exist');
    BreweryParameters.uploadExampleDatasetPart1(FILE_PATH_1);
    BreweryParameters.getExampleDatasetPart1FileName().should('have.text', FILE_PATH_1);
    ScenarioParameters.discard();
  });

  it('can delete an uploaded file and save the scenario', () => {
    ScenarioSelector.selectScenario(firstScenarioName, firstScenarioId);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('have.text', FILE_PATH_1);
    BreweryParameters.deleteExampleDatasetPart1();
    ScenarioParameters.save();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('not.exist');
  });

  it('can download an uploaded file that has been renamed, after a page refresh', () => {
    const breweryScenarioName = forgeScenarioName();
    let breweryScenarioId;
    scenarioNamesToDelete.push(breweryScenarioName);
    Scenarios.createScenario(breweryScenarioName, true, SCENARIO_DATASET, BREWERY_RUN_TEMPLATE).then((value) => {
      breweryScenarioId = value.scenarioCreatedId;
      BreweryParameters.switchToFileUploadTab();
      BreweryParameters.uploadInitialStock(FILE_PATH_1);
      ScenarioParameters.save();
      BreweryParameters.getInitialStockFileName().should('have.text', 'CSV file');
      BreweryParameters.downloadInitialStock();
      Downloads.checkByContent('initial_stock_dataset.csv', EXPECTED_DATA_AFTER_DUMMY_DATASET_1_UPLOAD);

      route.browse({ url: `${BREWERY_WORKSPACE_ID}/scenario/${breweryScenarioId}` });
      BreweryParameters.switchToFileUploadTab();
      BreweryParameters.downloadInitialStock();
      BreweryParameters.getInitialStockErrorMessage().should('not.exist');
    });
  });
});

describe('Simple operations on a file parameter in a parameters tab that lost focus', () => {
  beforeEach(() => {
    Login.login();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    ScenarioManager.deleteScenarioList(scenarioNamesToDelete);
  });

  let firstScenarioName;
  let firstScenarioId;
  it('can upload a file and save', () => {
    firstScenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(firstScenarioName);
    Scenarios.createScenario(firstScenarioName, true, SCENARIO_DATASET, BASIC_TYPES_RUN_TEMPLATE).then((value) => {
      firstScenarioId = value.scenarioCreatedId;
    });
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.uploadExampleDatasetPart3(FILE_PATH_1);
    BreweryParameters.switchToDatasetPartsTab();
    ScenarioParameters.save();
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.getExampleDatasetPart3DownloadButton().should('have.text', FILE_PATH_1);
  });

  it('can upload a file and delete it', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, BASIC_TYPES_RUN_TEMPLATE);
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.getExampleDatasetPart3DownloadButton().should('not.exist');
    BreweryParameters.getExampleDatasetPart3FileName().should('not.exist');
    BreweryParameters.uploadExampleDatasetPart3(FILE_PATH_1);
    BreweryParameters.deleteExampleDatasetPart3();
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.getExampleDatasetPart3DownloadButton().should('not.exist');
    BreweryParameters.getExampleDatasetPart3FileName().should('not.exist');
  });

  it('can upload a file and discard modifications', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, BASIC_TYPES_RUN_TEMPLATE);
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.uploadExampleDatasetPart3(FILE_PATH_1);
    BreweryParameters.switchToDatasetPartsTab();
    ScenarioParameters.discard();
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.getExampleDatasetPart3DownloadButton().should('not.exist');
    BreweryParameters.getExampleDatasetPart3FileName().should('not.exist');
  });

  it('can delete an uploaded file and save', () => {
    ScenarioSelector.selectScenario(firstScenarioName, firstScenarioId);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToBasicTypesTab();
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.getExampleDatasetPart3DownloadButton().should('have.text', FILE_PATH_1);
    BreweryParameters.deleteExampleDatasetPart3();
    BreweryParameters.switchToDatasetPartsTab();
    ScenarioParameters.save();
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.getExampleDatasetPart3DownloadButton().should('not.exist');
  });
});

describe('Scenario inheritance for file parameters', () => {
  beforeEach(() => {
    Login.login();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    ScenarioManager.deleteScenarioList(scenarioNamesToDelete);
  });

  const scenarioPrefix = forgeScenarioName();
  const grandParentScenarioName = scenarioPrefix + ' - GrandParent';
  const parentScenarioName = scenarioPrefix + ' - Parent';
  const childScenarioName = scenarioPrefix + ' - Child';

  let grandParentScenarioId;
  let parentScenarioId;

  it('can inherit a file in a child scenario', () => {
    Scenarios.createScenario(grandParentScenarioName, true, SCENARIO_DATASET, BASIC_TYPES_RUN_TEMPLATE).then(
      (value) => {
        grandParentScenarioId = value.scenarioCreatedId;
        scenarioNamesToDelete.push(grandParentScenarioName);
      }
    );
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.uploadExampleDatasetPart1(FILE_PATH_1);
    ScenarioParameters.save();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('have.text', FILE_PATH_1);

    Scenarios.createScenario(parentScenarioName, false, grandParentScenarioName, BASIC_TYPES_RUN_TEMPLATE).then(
      (value) => {
        parentScenarioId = value.scenarioCreatedId;
        scenarioNamesToDelete.push(parentScenarioName);
      }
    );
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('have.text', FILE_PATH_1);
    BreweryParameters.downloadExampleDatasetPart1();
    Downloads.checkByContent('dummy_dataset_1.csv', EXPECTED_DATA_AFTER_DUMMY_DATASET_1_UPLOAD);
  });

  it('can delete an inherited file without impacting the parent scenario', () => {
    ScenarioSelector.selectScenario(parentScenarioName, parentScenarioId);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('have.text', FILE_PATH_1);
    BreweryParameters.deleteExampleDatasetPart1();
    ScenarioParameters.save();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('not.exist');

    ScenarioSelector.selectScenario(grandParentScenarioName, grandParentScenarioId);
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('have.text', FILE_PATH_1);
  });

  it('should not inherit from a deleted file', () => {
    Scenarios.createScenario(childScenarioName, false, parentScenarioName, BASIC_TYPES_RUN_TEMPLATE);
    scenarioNamesToDelete.push(childScenarioName);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('not.exist');
  });
});

describe('File parameters in multiple tabs', () => {
  beforeEach(() => {
    Login.login();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    ScenarioManager.deleteScenarioList(scenarioNamesToDelete);
  });

  it('can create a scenario and upload several files, in several tabs', () => {
    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, BASIC_TYPES_RUN_TEMPLATE);
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.uploadExampleDatasetPart1(FILE_PATH_1);
    BreweryParameters.uploadExampleDatasetPart2(FILE_PATH_2);
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.uploadExampleDatasetPart3(FILE_PATH_1);
    ScenarioParameters.save();

    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('have.text', FILE_PATH_1);
    BreweryParameters.getExampleDatasetPart2DownloadButton().should('have.text', FILE_PATH_2);
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.getExampleDatasetPart3DownloadButton().should('have.text', FILE_PATH_1);
  });
});
