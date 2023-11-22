// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Login, DatasetManager } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { WORKSPACE, WORKSPACE_WITHOUT_CONFIG } from '../../fixtures/stubbing/DatasetManager';

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

describe('Data read in dataset manager', () => {
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
