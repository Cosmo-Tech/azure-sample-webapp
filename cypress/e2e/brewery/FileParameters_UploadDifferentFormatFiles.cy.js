// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { BASIC_PARAMETERS_SIMULATION_RUNNER } from '../../fixtures/stubbing/default';

const JSON_PATH = 'dummy_json.json';
const ZIP_PATH = 'dummy_zip.zip';
const CSV_PATH = 'dummy_dataset_1.csv';
describe('upload of files in different formats', () => {
  before(() => {
    stub.start();
    stub.setRunners([BASIC_PARAMETERS_SIMULATION_RUNNER]);
  });

  beforeEach(() => {
    // Disable interception middlewares (in stubbing), because they seem to prevent zip files from being uploaded
    Login.login({ noInterceptionMiddlewares: true });
  });

  after(() => {
    stub.stop();
  });

  it('uploads csv, json, zip files and save scenario', () => {
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.uploadExampleDatasetPart1(JSON_PATH);
    BreweryParameters.uploadExampleDatasetPart2(ZIP_PATH);
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.uploadExampleDatasetPart3(CSV_PATH);
    ScenarioParameters.save({
      datasetPartEvents: [{ id: 'dp-datasetPart1' }, { id: 'dp-datasetPart2' }, { id: 'dp-datasetPart3' }],
    });
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.getExampleDatasetPart1FileName().should('have.text', JSON_PATH);
    // shouldRenameFileOnUpload option is enabled in the stubbed solution for "dataset part 2", the file name will thus
    // be replaced by a generic label "ZIP file"
    BreweryParameters.getExampleDatasetPart2FileName().should('have.text', 'ZIP file');
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.getExampleDatasetPart3FileName().should('have.text', CSV_PATH);
  });
});
