// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, DatasetManager } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { DATASETS, WORKSPACE, WORKSPACE_WITHOUT_CONFIG } from '../../fixtures/stubbing/DatasetManager';

const WORKSPACES = [WORKSPACE, WORKSPACE_WITHOUT_CONFIG];

describe('Dataset manager view is optional', () => {
  before(() => {
    stub.start();
    stub.setWorkspaces(WORKSPACES);
  });

  beforeEach(() => {
    Login.login({ url: '/W-stbbdbrwryNoDM', workspaceId: 'W-stbbdbrwryNoDM' });
  });

  after(() => {
    stub.stop();
  });

  it('should not show the Dataset Manager tab when its configuration is not defined', () => {
    DatasetManager.getDatasetManagerTab().should('not.exist');
  });
});

describe('Dataset manager can be empty on start', () => {
  before(() => {
    stub.start();
    stub.setWorkspaces(WORKSPACES);
  });

  beforeEach(() => {
    Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' });
  });

  after(() => {
    stub.stop();
  });

  it('can create a dataset in an empty environment', () => {
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.getDatasetCreationDialog().should('not.exist');
    DatasetManager.getNoDatasetsPlaceholder().should('be.visible');
    DatasetManager.getCreateDatasetButton().should('be.visible');

    DatasetManager.getCreateDatasetButton().click();
    DatasetManager.getDatasetCreationDialog().should('be.visible');

    DatasetManager.getCancelDatasetCreation().click();
    DatasetManager.getDatasetCreationDialog().should('not.exist');
  });
});

describe('Data edition in dataset manager', () => {
  before(() => {
    stub.start();
    stub.setWorkspaces(WORKSPACES);
    stub.setDatasets(DATASETS);
  });

  beforeEach(() => {
    Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' });
  });

  after(() => {
    stub.stop();
  });

  it('can edit datasets metadata', () => {
    const DATASET_A = DATASETS[0];
    const DATASET_B = DATASETS[1];
    const DATASET_Z = DATASETS[2]; // Non-main dataset

    DatasetManager.switchToDatasetManagerView();

    DatasetManager.getDatasetsListItemButtons().should('have.length', 2);
    DatasetManager.getDatasetsListItemButton(DATASET_A.id).should('be.visible');
    DatasetManager.getDatasetsListItemButton(DATASET_B.id).should('be.visible');
    DatasetManager.getDatasetsListItemButton(DATASET_Z.id).should('not.exist');

    DatasetManager.selectDatasetById(DATASET_A.id);
    DatasetManager.getDatasetMetadataDescription().should('contain', DATASET_A.description);
    DatasetManager.getDatasetMetadataTags().should('have.length', 2);
    DatasetManager.getDatasetMetadataTag(0).should('contain', 'dataset');
    DatasetManager.getDatasetMetadataTag(1).should('contain', 'A');
    DatasetManager.selectDatasetById(DATASET_B.id);
    DatasetManager.getDatasetMetadataDescription().should('not.contain', DATASET_A.description);
    DatasetManager.getDatasetMetadataDescription().should('contain', DATASET_B.description);
    DatasetManager.getDatasetMetadataTag(1).should('contain', 'B');

    const newDescription = 'test new description';
    DatasetManager.editDatasetDescription(newDescription);
    DatasetManager.getDatasetMetadataDescription().should('contain', newDescription);
    DatasetManager.getDatasetMetadataDescription().should('not.contain', DATASET_B.description);
    const newTag = 'test new tag';
    DatasetManager.deleteDatasetTag(1);
    DatasetManager.getDatasetMetadataTags().should('have.length', 1);
    DatasetManager.addDatasetTag(newTag);
    DatasetManager.getDatasetMetadataTags().should('have.length', 2);
    DatasetManager.getDatasetMetadataTag(0).should('contain', 'dataset');
    DatasetManager.getDatasetMetadataTag(1).should('contain', newTag);

    DatasetManager.selectDatasetById(DATASET_A.id);
    DatasetManager.getDatasetMetadataDescription().should('contain', DATASET_A.description);
    DatasetManager.getDatasetMetadataTag(1).should('contain', 'A');
    DatasetManager.selectDatasetById(DATASET_B.id);
    DatasetManager.getDatasetMetadataDescription().should('contain', newDescription);
    DatasetManager.getDatasetMetadataTag(1).should('contain', newTag);
  });

  it('can create a new Azure Storage dataset', () => {
    const datasetName = 'My new dataset';
    const datasetDescription = 'My dataset description';
    const datasetTags = ['A', 'B', 'C'];
    const datasetStorageAccountName = 'My storage account';
    const datasetStorageContainerName = 'My storage container';
    const datasetStoragePath = 'my/storage/path';
    const expectedPayload = {
      name: datasetName,
      tags: ['A', 'C'],
      description: datasetDescription,
      sourceType: 'AzureStorage',
      source: {
        name: datasetStorageAccountName,
        location: datasetStorageContainerName,
        path: datasetStoragePath,
      },
    };
    const validateCreationRequest = (req) => {
      expect(req.body).to.deep.equal(expectedPayload);
    };

    DatasetManager.switchToDatasetManagerView();
    DatasetManager.getDatasetsListItemButtons().should('have.length', 2);
    DatasetManager.startDatasetCreation();
    DatasetManager.setNewDatasetName(datasetName);
    datasetTags.forEach((tag) => DatasetManager.addNewDatasetTag(tag));
    DatasetManager.deleteNewDatasetTag(1); // Delete tag 'B' at index 1
    DatasetManager.setNewDatasetDescription(datasetDescription);
    DatasetManager.getDatasetCreationNextStep().click();

    DatasetManager.selectNewDatasetFromExistingData();
    DatasetManager.selectNewDatasetFromScratch();
    DatasetManager.selectNewDatasetFromExistingData();
    DatasetManager.getDatasetCreationNextStep().click();

    DatasetManager.getNewDatasetSourceTypeSelect().click();
    DatasetManager.getNewDatasetSourceTypeOptionFile().click();
    DatasetManager.getNewDatasetSourceTypeSelect().click();
    DatasetManager.getNewDatasetSourceTypeOptionAzureStorage().click();

    DatasetManager.setNewDatasetAzureStorageAccountName(datasetStorageAccountName);
    DatasetManager.setNewDatasetAzureStorageContainerName(datasetStorageContainerName);
    DatasetManager.setNewDatasetAzureStoragePath(datasetStoragePath);
    DatasetManager.confirmDatasetCreation({ validateRequest: validateCreationRequest });

    DatasetManager.getDatasetMetadataTags().should('have.length', 2);
    DatasetManager.getDatasetMetadataTag(0).should('contain', 'A');
    DatasetManager.getDatasetMetadataTag(1).should('contain', 'C');
    DatasetManager.getDatasetMetadataDescription().should('contain', datasetDescription);
  });
});
