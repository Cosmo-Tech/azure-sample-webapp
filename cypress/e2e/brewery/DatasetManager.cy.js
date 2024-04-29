// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, DatasetManager } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import {
  DATASETS,
  WORKSPACE,
  DATASETS_TO_FILTER,
  DATASETS_TO_REFRESH,
  ORGANIZATION_WITH_DEFAULT_ROLE_USER,
} from '../../fixtures/stubbing/DatasetManager';
import { USER_EXAMPLE } from '../../fixtures/stubbing/default';

const WORKSPACES = [WORKSPACE];

describe('Dataset manager can be empty on start', () => {
  before(() => {
    stub.start();
    stub.setOrganizations([ORGANIZATION_WITH_DEFAULT_ROLE_USER]);
    stub.setWorkspaces(WORKSPACES);
  });
  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' }));
  after(stub.stop);

  it('can create a dataset in an empty environment', () => {
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.getDatasetCreationDialog().should('not.exist');
    DatasetManager.getNoDatasetsPlaceholder().should('be.visible');
    DatasetManager.getNoDatasetsPlaceholderViewerSubtitle().should('not.exist');
    DatasetManager.getNoDatasetsPlaceholderUserSubtitle().should('be.visible');
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
    // we use the copy of DATASETS array to be able to reuse the same fixture
    // in all tests in the suite. The cypress doc says that  "fixture files are
    // assumed to be unchanged during the test, and thus Cypress loads them just once",
    // perhaps, we are modifying the list while creating and deleting datasets, so,
    // to keep the same list at the beginning of every describe block, we provide a copy
    // to stubbing function
    stub.setDatasets([...DATASETS]);
  });
  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' }));
  after(stub.stop);

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
});

describe('Dataset creation', () => {
  const datasetAuthor = USER_EXAMPLE.name;

  before(() => {
    stub.start();
    stub.setOrganizations([ORGANIZATION_WITH_DEFAULT_ROLE_USER]);
    stub.setWorkspaces(WORKSPACES);
    stub.setDatasets([...DATASETS]);
  });
  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' }));
  after(stub.stop);

  it('can create a new Azure Storage dataset', () => {
    const datasetName = 'My new dataset';
    const datasetDescription = 'My dataset description';
    const datasetTags = ['A', 'B', 'C'];
    const datasetStorageAccountName = 'My storage account';
    const datasetStorageContainerName = 'My storage container';
    const datasetStoragePath = 'my/storage/path';
    const expectedPayload = {
      name: datasetName,
      ownerName: datasetAuthor,
      tags: ['A', 'C'],
      description: datasetDescription,
      sourceType: 'AzureStorage',
      security: { default: 'none', accessControlList: [{ id: 'dev.sample.webapp@example.com', role: 'admin' }] },
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
    DatasetManager.getDatasetMetadataAuthor().should('contain', datasetAuthor);

    DatasetManager.getDatasetNameInOverview().should('have.text', datasetName);
  });

  it('can create a new ADT dataset', () => {
    const datasetName = 'My ADT dataset';
    const datasetDescription = 'My ADT dataset description';
    const datasetTags = ['adt', 'tag'];
    const datasetADTUrl = 'adt/url';
    const expectedPayload = {
      name: datasetName,
      ownerName: datasetAuthor,
      tags: ['adt', 'tag'],
      description: datasetDescription,
      sourceType: 'ADT',
      security: { default: 'none', accessControlList: [{ id: 'dev.sample.webapp@example.com', role: 'admin' }] },
      source: {
        location: datasetADTUrl,
      },
    };
    const validateCreationRequest = (req) => {
      expect(req.body).to.deep.equal(expectedPayload);
    };

    DatasetManager.switchToDatasetManagerView();
    DatasetManager.startDatasetCreation();
    DatasetManager.setNewDatasetName(datasetName);
    datasetTags.forEach((tag) => DatasetManager.addNewDatasetTag(tag));
    DatasetManager.setNewDatasetDescription(datasetDescription);
    DatasetManager.getDatasetCreationNextStep().click();

    DatasetManager.getDatasetCreationPreviousStep().click();
    DatasetManager.getNewDatasetNameInput().should('value', datasetName);

    DatasetManager.getDatasetCreationNextStep().click();

    DatasetManager.getNewDatasetSourceTypeSelect().click();
    DatasetManager.getNewDatasetSourceTypeOptionADT().click();

    DatasetManager.setNewDatasetADTURL(datasetADTUrl);
    DatasetManager.confirmDatasetCreation({ validateRequest: validateCreationRequest });

    DatasetManager.getDatasetMetadataTags().should('have.length', 2);
    DatasetManager.getDatasetMetadataTag(0).should('contain', 'adt');
    DatasetManager.getDatasetMetadataTag(1).should('contain', 'tag');
    DatasetManager.getDatasetMetadataDescription().should('contain', datasetDescription);
    DatasetManager.getDatasetMetadataAuthor().should('contain', datasetAuthor);
  });
});

describe('Filtering datasets list', () => {
  before(() => {
    stub.start();
    stub.setWorkspaces(WORKSPACES);
    stub.setDatasets(DATASETS_TO_FILTER);
  });
  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' }));
  after(stub.stop);

  it('can filter datasets by name and by tag', () => {
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.getDatasetsListItemButtons().should('have.length', DATASETS_TO_FILTER.length);
    DatasetManager.getDatasetSearchBar().click().type('Amsterdam');
    DatasetManager.getDatasetsListItemButtons().should('have.length', 1);
    DatasetManager.getDatasetsListItemButton(DATASETS_TO_FILTER[0].id).should('be.visible');
    DatasetManager.getDatasetSearchBarInput().click().clear();
    DatasetManager.getDatasetsListItemButtons().should('have.length', DATASETS_TO_FILTER.length);
    DatasetManager.getDatasetSearchBar().click().type('size-2xl');
    DatasetManager.getDatasetsListItemButtons().should('have.length', 1);
    DatasetManager.getDatasetsListItemButton(DATASETS_TO_FILTER[3].id).should('be.visible');
    DatasetManager.getDatasetSearchBarInput().click().clear();
    DatasetManager.getDatasetsListItemButtons().should('have.length', DATASETS_TO_FILTER.length);
    DatasetManager.getDatasetSearchBar().click().type('random');
    DatasetManager.getDatasetsListItemButtons().should('have.length', 4);
    DatasetManager.getDatasetsListItemButton(DATASETS_TO_FILTER[3].id).should('not.exist');
  });
});

describe('Dataset delete', () => {
  before(() => {
    stub.start();
    stub.setWorkspaces(WORKSPACES);
    stub.setDatasets([...DATASETS]);
  });
  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' }));
  after(stub.stop);

  it('can delete all scenarios from the list and display noDatasets placeholder', () => {
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.getDatasetsListItemButtons().should('have.length', 2);
    DatasetManager.getDatasetDeleteButton(DATASETS[0].id).click();
    DatasetManager.getDeleteDatasetDialog().should('be.visible');
    DatasetManager.getDeleteDatasetDialogBody().contains(DATASETS[0].name);
    DatasetManager.closeDeleteDatasetDialog();
    DatasetManager.deleteDataset(DATASETS[0].id, DATASETS[0].name);
    DatasetManager.getDatasetsListItemButtons().should('have.length', 1);
    DatasetManager.deleteDataset(DATASETS[1].id, DATASETS[1].name);
    DatasetManager.getNoDatasetsPlaceholder().should('be.visible');
    DatasetManager.getNoDatasetsPlaceholderUserSubtitle().should('not.exist'); // Default role not set to "user"
  });
});

describe('Refresh dataset', () => {
  before(() => {
    stub.start();
    stub.setWorkspaces(WORKSPACES);
    stub.setDatasets(DATASETS_TO_REFRESH);
  });
  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' }));
  after(stub.stop);

  it(
    'can refresh ADT and AzureStorage datasets and display en empty dataset placeholder ' +
      'for the one created from scratch',
    () => {
      const refreshSuccessOptions = {
        expectedPollsCount: 2,
        finalIngestionStatus: 'SUCCESS',
      };

      const refreshFailedOptions = {
        expectedPollsCount: 2,
        finalIngestionStatus: 'ERROR',
      };
      DatasetManager.switchToDatasetManagerView();
      DatasetManager.getDatasetRefreshButton(DATASETS_TO_REFRESH[2].id).should('not.exist');
      DatasetManager.selectDatasetById(DATASETS_TO_REFRESH[2].id);
      DatasetManager.getDatasetOverviewPlaceholder().should('be.visible');
      DatasetManager.getDatasetOverviewPlaceholderTitle().contains('empty');
      DatasetManager.getDatasetOverviewPlaceholderApiLink().contains('Cosmo Tech API');
      DatasetManager.selectDatasetById(DATASETS_TO_REFRESH[0].id);
      DatasetManager.refreshDataset(DATASETS_TO_REFRESH[0].id, refreshSuccessOptions);
      DatasetManager.getDatasetOverviewPlaceholder().should('be.visible');
      DatasetManager.getDatasetOverviewPlaceholder().contains('Importing');
      DatasetManager.getDatasetOverviewPlaceholder(30).should('not.exist');
      DatasetManager.getRefreshDatasetSpinner(DATASETS_TO_REFRESH[0].id).should('not.exist');
      DatasetManager.selectDatasetById(DATASETS_TO_REFRESH[1].id);
      DatasetManager.refreshDataset(DATASETS_TO_REFRESH[1].id, refreshFailedOptions);
      DatasetManager.selectDatasetById(DATASETS_TO_REFRESH[1].id);
      DatasetManager.getDatasetOverviewPlaceholderTitle().contains('An error', { timeout: 30000 });
      DatasetManager.getDatasetOverviewPlaceholderRetryButton().should('exist');
      DatasetManager.getDatasetOverviewPlaceholderRollbackButton().should('exist');
      DatasetManager.getRefreshDatasetErrorIcon(DATASETS_TO_REFRESH[1].id).should('be.visible');
      DatasetManager.rollbackDatasetStatus();
      DatasetManager.getDatasetNameInOverview().should('be.visible');
    }
  );
});
