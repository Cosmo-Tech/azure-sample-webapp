// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Login, DatasetManager } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { DATASETS, WORKSPACE, WORKSPACE_WITHOUT_CONFIG } from '../../fixtures/stubbing/DatasetManager';

const WORKSPACES = [WORKSPACE, WORKSPACE_WITHOUT_CONFIG];

describe('Dataset manager is optional', () => {
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

describe('Dataset manager can be empty', () => {
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

  it('supports an empty list of datasets', () => {
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
    DatasetManager.selectDatasetById(DATASET_B.id);
    DatasetManager.getDatasetMetadataDescription().should('not.contain', DATASET_A.description);
    DatasetManager.getDatasetMetadataDescription().should('contain', DATASET_B.description);

    // TODO: edit datasets metadata
  });
});
