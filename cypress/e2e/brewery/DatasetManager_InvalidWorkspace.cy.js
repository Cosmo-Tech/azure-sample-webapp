// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import rfdc from 'rfdc';
import { Login, DatasetManager, ErrorBanner } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { DATASETS, WORKSPACE } from '../../fixtures/stubbing/DatasetManager';

const clone = rfdc();
const INVALID_WORKSPACE = clone(WORKSPACE);
INVALID_WORKSPACE.additionalData.webapp.datasetManager = 'invalidOnPurpose';

describe('Dataset manager from invalid workspace configuration', () => {
  before(() => {
    stub.start();
    stub.setWorkspaces([INVALID_WORKSPACE]);
    stub.setDatasets([...DATASETS]);
  });
  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' }));
  after(() => stub.stop());

  it('must still let users create datasets', () => {
    const DATASET_A = DATASETS[0];
    const newDatasetName = 'Cypress dataset - invalid workspace config';
    const newDatasetValue = 'some value';

    DatasetManager.ignoreDatasetQueries();
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.getDatasetManagerView().should('be.visible');
    ErrorBanner.getErrorBanner().should('not.be.visible');

    // Existing datasets and their overview must still render despite the malformed "datasetManager" config
    DatasetManager.getDatasetsListItemButtons().should('have.length', 4);
    DatasetManager.selectDatasetById(DATASET_A.id);
    DatasetManager.getDatasetNameInOverview().should('have.text', DATASET_A.name);
    DatasetManager.getDatasetMetadataDescription().should('contain', DATASET_A.description);
    // No categories/KPIs can be rendered since the invalid config cannot provide any
    DatasetManager.getCategoryNames().should('not.exist');
    DatasetManager.getIndicatorCards().should('not.exist');
    ErrorBanner.getErrorBanner().should('not.be.visible');

    // Dataset creation must still work
    DatasetManager.startDatasetCreation();
    DatasetManager.setNewDatasetName(newDatasetName);
    DatasetManager.getDatasetCreationNextStep().click();
    DatasetManager.selectNewDatasetSourceType('partially_prefilled_datasource');
    cy.get('[data-cy=text-input-etl_string_parameter]').type(newDatasetValue);
    DatasetManager.confirmDatasetCreation({ isETL: true });

    DatasetManager.getDatasetNameInOverview().should('have.text', newDatasetName);
    DatasetManager.getDatasetsListItemButtons().should('have.length', 5);
    ErrorBanner.getErrorBanner().should('not.be.visible');
  });
});
