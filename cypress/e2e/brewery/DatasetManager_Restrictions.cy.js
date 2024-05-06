// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, DatasetManager } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import {
  DATASETS,
  WORKSPACE,
  WORKSPACE_WITHOUT_CONFIG,
  ORGANIZATION_WITH_DEFAULT_ROLE_VIEWER,
} from '../../fixtures/stubbing/DatasetManager';

const WORKSPACES = [WORKSPACE, WORKSPACE_WITHOUT_CONFIG];

describe('Dataset manager view is optional', () => {
  before(() => {
    stub.start();
    stub.setWorkspaces(WORKSPACES);
  });
  beforeEach(() => Login.login({ url: '/W-stbbdbrwryNoDM', workspaceId: 'W-stbbdbrwryNoDM' }));
  after(stub.stop);

  it('should not show the Dataset Manager tab when its configuration is not defined', () => {
    DatasetManager.getDatasetManagerTab().should('not.exist');
  });
});

describe('Viewer role in an empty dataset manager', () => {
  before(() => {
    stub.start();
    stub.setOrganizations([ORGANIZATION_WITH_DEFAULT_ROLE_VIEWER]);
    stub.setWorkspaces(WORKSPACES);
  });
  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' }));
  after(stub.stop);

  it('cannot create datasets from the overview placeholder', () => {
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.getDatasetCreationDialog().should('not.exist');
    DatasetManager.getNoDatasetsPlaceholder().should('be.visible');
    DatasetManager.getNoDatasetsPlaceholderViewerSubtitle().should('be.visible');
    DatasetManager.getNoDatasetsPlaceholderUserSubtitle().should('not.exist');
    DatasetManager.getCreateDatasetButton().should('not.exist');
  });
});

describe('Viewer role in a non-empty dataset manager', () => {
  before(() => {
    stub.start();
    stub.setOrganizations([ORGANIZATION_WITH_DEFAULT_ROLE_VIEWER]);
    stub.setWorkspaces(WORKSPACES);
    stub.setDatasets([...DATASETS]);
  });
  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' }));
  after(stub.stop);

  it('cannot create datasets & subdatasets', () => {
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.getDatasetCreationDialog().should('not.exist');
    DatasetManager.getCreateDatasetButton().should('not.exist');
    DatasetManager.getCreateSubdatasetButton().should('not.exist');
    DatasetManager.getNoDatasetsPlaceholder().should('not.exist');
  });
});
