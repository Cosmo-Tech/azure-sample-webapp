// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DatasetManager, Login } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { SOLUTION, WORKSPACE, ORGANIZATION_WITH_DEFAULT_ROLE_USER } from '../../fixtures/stubbing/DatasetManager';
import { EDITABLE_DATASET, NON_EDITABLE_DATASET } from '../../fixtures/stubbing/RenameDataset';

describe('rename datasets in Dataset Manager view', () => {
  before(() => {
    const linkedWorkspace = { ...WORKSPACE, linkedDatasetIdList: [EDITABLE_DATASET.id, NON_EDITABLE_DATASET.id] };
    stub.start();
    stub.setOrganizations([ORGANIZATION_WITH_DEFAULT_ROLE_USER]);
    stub.setSolutions([SOLUTION]);
    stub.setWorkspaces([linkedWorkspace]);
    console.log(EDITABLE_DATASET, NON_EDITABLE_DATASET);
    stub.setDatasets([EDITABLE_DATASET, NON_EDITABLE_DATASET]);
  });

  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM/datasetmanager', workspaceId: 'W-stbbdbrwryWithDM' }));
  after(stub.stop);

  it('cannot rename datasets if role is viewer', () => {
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.selectDatasetById(NON_EDITABLE_DATASET.id);
    DatasetManager.getDatasetNameInOverview().should('have.text', NON_EDITABLE_DATASET.name);
    DatasetManager.getDatasetNameEditableTextField().should('not.exist');
    DatasetManager.getRenameDatasetButton().should('not.exist');
  });

  it('can rename datasets if role is editor', () => {
    const datasetName = EDITABLE_DATASET.name;
    const newName = 'renamed';

    DatasetManager.switchToDatasetManagerView();
    DatasetManager.selectDatasetById(EDITABLE_DATASET.id);
    DatasetManager.getDatasetNameInOverview().should('have.text', datasetName);
    DatasetManager.getDatasetNameEditableTextField().should('not.exist');
    DatasetManager.getRenameDatasetButton().should('exist').should('be.visible');

    // Edit & cancel without confirming the changes
    DatasetManager.getRenameDatasetButton().click();
    DatasetManager.getDatasetNameInOverview().should('not.exist');
    DatasetManager.getDatasetNameEditableTextField().should('exist').should('be.visible');
    DatasetManager.getDatasetNameEditableTextField().type('{selectAll}{backspace}' + newName + '{esc}');
    DatasetManager.getDatasetNameEditableTextField().should('not.exist'); // Input field disappeared
    DatasetManager.getDatasetNameInOverview().should('have.text', datasetName); // Initial name remained unchanged

    // Edit & confirm
    const validateRequest = (query) => {
      console.log(query);
      return true;
    };
    DatasetManager.renameDataset(newName, { validateRequest });
    DatasetManager.getDatasetNameInOverview().should('have.text', newName); // Dataset name has been changed

    // Switch between dataset and check that the new name has been persisted
    DatasetManager.selectDatasetById(NON_EDITABLE_DATASET.id);
    DatasetManager.getDatasetNameInOverview().should('have.text', NON_EDITABLE_DATASET.name);
    DatasetManager.selectDatasetById(EDITABLE_DATASET.id);
    DatasetManager.getDatasetNameInOverview().should('have.text', newName);
  });
});
