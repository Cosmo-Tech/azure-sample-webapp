// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, DatasetManager } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import {
  ORGANIZATION_WITH_DEFAULT_ROLE_USER,
  WORKSPACE_FOR_ETL,
  SOLUTION_FOR_ETL,
} from '../../fixtures/stubbing/DatasetManager';

const LOGIN_OPTIONS_FOR_ETL = { url: `/${WORKSPACE_FOR_ETL.id}`, workspaceId: WORKSPACE_FOR_ETL.id };

describe('Can create and launch a dataset linked to a runner', () => {
  before(() => {
    stub.start();
    stub.setOrganizations([ORGANIZATION_WITH_DEFAULT_ROLE_USER]);
    stub.setSolutions([SOLUTION_FOR_ETL]);
    stub.setWorkspaces([WORKSPACE_FOR_ETL]);
  });

  beforeEach(() => {
    Login.login(LOGIN_OPTIONS_FOR_ETL);
  });

  after(() => {
    stub.stop();
  });

  it('can create a dataset linked to a runner', () => {
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
