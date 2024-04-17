// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, DatasetManager } from '../../commons/actions';
import { RolesEdition } from '../../commons/actions/generic/RolesEdition';
import { ROLES } from '../../commons/constants/generic/TestConstants';
import { stub } from '../../commons/services/stubbing';
import { setup } from '../../commons/utils/setup';
import { WORKSPACE_WITH_USERS_LIST } from '../../fixtures/stubbing/DatasetSharing';
import { PRIVATE_DATASETS_LIST } from '../../fixtures/stubbing/DatasetSharing/datasets';
import { USER_EXAMPLE, USERS_LIST } from '../../fixtures/stubbing/default';

describe('Check permissions shared dataset', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start();
  });

  beforeEach(() => {
    stub.setDatasets([...PRIVATE_DATASETS_LIST]);
    stub.setWorkspaces([WORKSPACE_WITH_USERS_LIST]);
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('Share a dataset to other users', () => {
    DatasetManager.switchToDatasetManagerView();

    DatasetManager.selectDatasetById(PRIVATE_DATASETS_LIST[0].id);
    DatasetManager.getDatasetShareButton(PRIVATE_DATASETS_LIST[0].id)
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    RolesEdition.addAgent(USERS_LIST[1].email);
    RolesEdition.getShareDialogRolesCheckbox(ROLES.DATASET.VIEWER).should('not.be.disabled').click();
    RolesEdition.getShareDialogConfirmAddAccessButton().should('not.be.disabled').click();
    RolesEdition.addAgent(USERS_LIST[2].email);
    RolesEdition.getShareDialogRolesCheckbox(ROLES.DATASET.EDITOR).should('not.be.disabled').click();
    RolesEdition.getShareDialogConfirmAddAccessButton().should('not.be.disabled').click();
    RolesEdition.addAgent(USERS_LIST[3].email);
    RolesEdition.getShareDialogRolesCheckbox(ROLES.DATASET.ADMIN).should('not.be.disabled').click();
    RolesEdition.getShareDialogConfirmAddAccessButton().should('not.be.disabled').click();
    RolesEdition.selectOptionByAgent('Workspace', ROLES.SCENARIO.VIEWER);

    const expectedSecurity = {
      default: ROLES.DATASET.VIEWER,
      accessControlList: [
        { id: USERS_LIST[1].email, role: ROLES.DATASET.VIEWER },
        { id: USERS_LIST[2].email, role: ROLES.DATASET.EDITOR },
        { id: USERS_LIST[3].email, role: ROLES.DATASET.ADMIN },
      ],
    };
    RolesEdition.confirmDatasetNewPermissions(expectedSecurity);
  });

  it('Is shown a message error when last admin is removed', () => {
    DatasetManager.switchToDatasetManagerView();

    RolesEdition.getShareButton().should('be.visible').should('not.be.disabled').click();
    RolesEdition.removeAgent(USER_EXAMPLE.email);
    RolesEdition.getNoAdminErrorMessage().should('be.visible');
    RolesEdition.getShareDialogSubmitButton().should('be.disabled');
  });
});
