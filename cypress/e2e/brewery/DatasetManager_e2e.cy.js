// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { DatasetManager, ErrorBanner } from '../../commons/actions';
import { Login } from '../../commons/actions/brewery';

const DATA_INGESTION_DURATION = 180;

describe('End-to-end test of the dataset manager view', () => {
  beforeEach(() => {
    Login.login();
  });

  it('can create a dataset from file upload', () => {
    const REFERENCE_DATASET_ZIP_FILE_PATH = 'datasets/reference_dataset.zip';
    const NINE_CUSTOMERS_DATASET_ZIP_FILE_PATH = 'datasets/nine_customers.zip';
    const fileDatasetName = `cypress dataset - e2e - ${utils.randomStr(5)}`;

    DatasetManager.switchToDatasetManagerView();
    DatasetManager.startDatasetCreation();
    DatasetManager.setNewDatasetName(fileDatasetName);
    DatasetManager.addNewDatasetTag('file');
    DatasetManager.setNewDatasetDescription('Dataset created from file upload, during cypress end-to-end test');
    DatasetManager.getDatasetCreationNextStep().click();

    DatasetManager.getNewDatasetSourceTypeSelect().click();
    DatasetManager.getNewDatasetSourceTypeOptionFile().click();

    DatasetManager.uploadFileInWizard(REFERENCE_DATASET_ZIP_FILE_PATH);
    DatasetManager.confirmDatasetCreation({ isFile: true });

    DatasetManager.getDatasetSearchBarInput().click().type(fileDatasetName);
    DatasetManager.getAllRefreshDatasetSpinners(DATA_INGESTION_DURATION).should('not.exist');
    DatasetManager.getIndicatorCard('satisfaction_links_count').should('be.visible');
    DatasetManager.getKpiValue(DatasetManager.getIndicatorCard('satisfaction_links_count')).should('have.text', 8);

    DatasetManager.getDatasetsListItemButtons().should('have.length', 1);
    DatasetManager.getAllReuploadDatasetButtons().click();
    DatasetManager.getConfirmDatasetRefreshButton().click();
    DatasetManager.getAllReuploadDatasetInputs().attachFile(NINE_CUSTOMERS_DATASET_ZIP_FILE_PATH);
    DatasetManager.getKpiValue(DatasetManager.getIndicatorCard('satisfaction_links_count'), 10).should('have.text', 16);

    DatasetManager.getAllDeleteDatasetButtons().click();
    DatasetManager.getDeleteDatasetDialogBody().contains(fileDatasetName);
    DatasetManager.getDeleteDatasetConfirmButton().click();
    ErrorBanner.getErrorBanner().should('not.be.visible');
  });
});
