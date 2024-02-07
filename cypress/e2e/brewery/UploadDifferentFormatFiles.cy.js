// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { ScenarioManager, ScenarioParameters, Scenarios } from '../../commons/actions';
import { BreweryParameters, Login } from '../../commons/actions/brewery';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';

const JSON_PATH = 'dummy_json.json';
const ZIP_PATH = 'dummy_zip.zip';
const CSV_PATH = 'dummy_dataset_1.csv';
describe('upload of files in different formats', () => {
  const scenario = 'Test Cypress - File Upload - ' + utils.randomStr(7);
  before(() => {
    // Disable interception middlewares (in stubbing), because they seem to prevent zip files from being uploaded
    Login.login({ noInterceptionMiddlewares: true });
  });

  after(() => {
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.deleteScenario(scenario);
  });

  it('uploads csv, json, zip files and save scenario', () => {
    Scenarios.createScenario(scenario, true, DATASET.BREWERY_ADT, RUN_TEMPLATE.BASIC_TYPES);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.uploadExampleDatasetPart1(JSON_PATH);
    BreweryParameters.uploadExampleDatasetPart2(ZIP_PATH);
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.uploadExampleDatasetPart3(CSV_PATH);
    ScenarioParameters.save();
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('have.text', JSON_PATH);
    BreweryParameters.getExampleDatasetPart2DownloadButton().should('have.text', ZIP_PATH);
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.getExampleDatasetPart3DownloadButton().should('have.text', CSV_PATH);
  });
});
