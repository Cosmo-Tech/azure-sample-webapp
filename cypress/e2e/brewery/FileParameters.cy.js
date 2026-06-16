// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Downloads, Login, ScenarioParameters, ScenarioSelector } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { fileUtils } from '../../commons/utils';
import {
  EXPECTED_DATA_AFTER_DUMMY_DATASET_1_UPLOAD,
  EXPECTED_DATA_AFTER_DUMMY_DATASET_2_UPLOAD,
} from '../../fixtures/FileParametersData';
import { BASIC_PARAMETERS_SIMULATION_RUNNER, BREWERY_SIMULATION_RUNNER } from '../../fixtures/stubbing/default';

const FILE_PATH_1 = 'dummy_dataset_1.csv';
const FILE_PATH_2 = 'dummy_dataset_2.csv';

const getFormDataFromRequest = (req) => {
  const serializedFormData = fileUtils.parseMultipartFormData(req.body)?.datasetPartCreateRequest;
  return JSON.parse(serializedFormData);
};

describe('File parameters', () => {
  before(() => {
    stub.start();
    stub.setRunners([BASIC_PARAMETERS_SIMULATION_RUNNER, BREWERY_SIMULATION_RUNNER]);
  });

  beforeEach(() => Login.login());

  after(() => {
    stub.stop();
    Downloads.clearDownloadsFolder();
  });

  it('local changes without saving: can modify, undo and discard changes after a file upload', () => {
    ScenarioSelector.selectScenario(BASIC_PARAMETERS_SIMULATION_RUNNER.name, BASIC_PARAMETERS_SIMULATION_RUNNER.id);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToDatasetPartsTab();

    // Upload file, then check UI feedback
    BreweryParameters.uploadExampleDatasetPart1(FILE_PATH_1);
    BreweryParameters.getExampleDatasetPart1FileName().should('have.text', FILE_PATH_1);
    ScenarioParameters.getSaveButton().should('be.visible');
    // Upload a different file
    BreweryParameters.uploadExampleDatasetPart1(FILE_PATH_2);
    BreweryParameters.getExampleDatasetPart1FileName().should('have.text', FILE_PATH_2);
    // Clear the file field
    BreweryParameters.deleteExampleDatasetPart1();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('not.exist');
    BreweryParameters.getExampleDatasetPart1FileName().should('not.exist');
    ScenarioParameters.getSaveButton().should('not.exist');
    // Upload & discard
    BreweryParameters.uploadExampleDatasetPart1(FILE_PATH_1);
    BreweryParameters.getExampleDatasetPart1FileName().should('have.text', FILE_PATH_1);
    ScenarioParameters.discard();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('not.exist');
    BreweryParameters.getExampleDatasetPart1FileName().should('not.exist');
    ScenarioParameters.getSaveButton().should('not.exist');
  });

  it('overwrite file parameter: can replace a file previously uploaded and saved', () => {
    ScenarioSelector.selectScenario(BREWERY_SIMULATION_RUNNER.name, BREWERY_SIMULATION_RUNNER.id);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToFileUploadTab();

    // Upload & save
    BreweryParameters.uploadInitialStock(FILE_PATH_1);
    ScenarioParameters.save({
      datasetPartEvents: [
        {
          id: 'dp-datasetPart1',
          validateRequest: (req) => expect(getFormDataFromRequest(req)?.sourceName).to.equal(FILE_PATH_1),
        },
      ],
    });
    BreweryParameters.getInitialStockFileName().should('have.text', FILE_PATH_1);
    BreweryParameters.downloadInitialStock();
    Downloads.checkByContent(FILE_PATH_1, EXPECTED_DATA_AFTER_DUMMY_DATASET_1_UPLOAD);

    // Upload a different file & save
    BreweryParameters.uploadInitialStock(FILE_PATH_2);
    ScenarioParameters.save({
      datasetPartEvents: [
        { id: 'dp-datasetPart1', delete: true },
        {
          id: 'dp-datasetPart2',
          validateRequest: (req) => expect(getFormDataFromRequest(req)?.sourceName).to.equal(FILE_PATH_2),
        },
      ],
    });
    BreweryParameters.getInitialStockFileName().should('have.text', FILE_PATH_2);
    BreweryParameters.downloadInitialStock();
    Downloads.checkByContent(FILE_PATH_2, EXPECTED_DATA_AFTER_DUMMY_DATASET_2_UPLOAD);
  });

  it('clear file parameter: can delete a file previously uploaded and saved', () => {
    ScenarioSelector.selectScenario(BREWERY_SIMULATION_RUNNER.name, BREWERY_SIMULATION_RUNNER.id);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToFileUploadTab();

    // Upload & save
    BreweryParameters.uploadInitialStock(FILE_PATH_1);
    ScenarioParameters.save({
      datasetPartEvents: [
        {
          id: 'dp-datasetPart1',
          validateRequest: (req) => expect(getFormDataFromRequest(req)?.sourceName).to.equal(FILE_PATH_1),
        },
      ],
    });
    BreweryParameters.getInitialStockFileName().should('have.text', FILE_PATH_1);

    // Clear file & save
    BreweryParameters.getInitialStockDeleteButton().click();
    ScenarioParameters.save({ datasetPartEvents: [{ id: 'dp-datasetPart1', delete: true }] });
    BreweryParameters.getInitialStockFileName().should('not.exist');
  });

  it('option shouldRenameFileOnUpload: can download an uploaded file that has been renamed', () => {
    ScenarioSelector.selectScenario(BASIC_PARAMETERS_SIMULATION_RUNNER.name, BASIC_PARAMETERS_SIMULATION_RUNNER.id);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToDatasetPartsTab();

    BreweryParameters.uploadExampleDatasetPart2(FILE_PATH_1);
    ScenarioParameters.save({
      datasetPartEvents: [
        {
          id: 'dp-datasetPart1',
          validateRequest: (req) => expect(getFormDataFromRequest(req)?.sourceName).to.equal(FILE_PATH_1),
        },
      ],
    });

    BreweryParameters.getExampleDatasetPart2FileName().should('have.text', 'CSV file');
    BreweryParameters.downloadExampleDatasetPart2();
    // BUG: option shouldRenameFileOnUpload is not fully respected. The downloaded file still has the name of the file
    // that was uploaded
    // TODO: update this test when the bug is fixed
    Downloads.checkByContent(FILE_PATH_1, EXPECTED_DATA_AFTER_DUMMY_DATASET_1_UPLOAD);
  });
});
