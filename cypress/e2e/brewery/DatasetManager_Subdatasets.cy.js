// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import rfdc from 'rfdc';
import { Login, DatasetManager } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import {
  CUSTOM_SUBDATASOURCES,
  DATASETS,
  SOLUTION,
  WORKSPACE,
  ORGANIZATION_WITH_DEFAULT_ROLE_USER,
} from '../../fixtures/stubbing/DatasetManager';

const clone = rfdc();

const WORKSPACE_WITH_SOURCE_FILTERS = clone(WORKSPACE);
WORKSPACE_WITH_SOURCE_FILTERS.webApp.options.datasetManager.subdatasourceFilter = ['list_filter', 'string_filter'];

const WORKSPACE_WITH_EMPTY_FILTERS = clone(WORKSPACE);
WORKSPACE_WITH_EMPTY_FILTERS.webApp.options.datasetManager.subdatasourceFilter = [];

const forgeSubdatasetNameFromParentName = (parentName) => `${parentName} (subdataset)`;

describe('Subdatasources in subdataset creation wizard when no whitelist is defined', () => {
  before(() => {
    stub.start();
    stub.setOrganizations([ORGANIZATION_WITH_DEFAULT_ROLE_USER]);
    stub.setSolutions([SOLUTION]);
    stub.setWorkspaces([WORKSPACE]);
    stub.setDatasets([...DATASETS]);
  });
  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' }));
  after(stub.stop);

  it('shows all subdatasources', () => {
    const DATASET_A = DATASETS[0];
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.selectDatasetById(DATASET_A.id);
    DatasetManager.startSubdatasetCreation();
    DatasetManager.getDatasetCreationNextStep().click();
    DatasetManager.getNewDatasetSourceTypeSelect().click();
    DatasetManager.getNewDatasetSourceTypeOptions().should('have.length', CUSTOM_SUBDATASOURCES.length);
    DatasetManager.getNewDatasetSourceTypeOptions().should('have.length', 5);
  });
});

describe('Subdatasources in subdataset creation wizard when whitelist is defined', () => {
  before(() => {
    stub.start();
    stub.setOrganizations([ORGANIZATION_WITH_DEFAULT_ROLE_USER]);
    stub.setSolutions([SOLUTION]);
    stub.setWorkspaces([WORKSPACE_WITH_SOURCE_FILTERS]);
    stub.setDatasets([...DATASETS]);
  });
  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' }));
  after(stub.stop);

  it('shows only subdatasources defined in whitelist', () => {
    const DATASET_A = DATASETS[0];
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.selectDatasetById(DATASET_A.id);
    DatasetManager.startSubdatasetCreation();
    DatasetManager.getDatasetCreationNextStep().click();
    DatasetManager.getNewDatasetSourceTypeSelect().click();
    DatasetManager.getNewDatasetSourceTypeOptions().should('have.length', 2); // Only 2 sources defined in whitelist
  });
});

describe('Subdatasources in subdataset creation wizard when whitelist is empty', () => {
  before(() => {
    stub.start();
    stub.setOrganizations([ORGANIZATION_WITH_DEFAULT_ROLE_USER]);
    stub.setSolutions([SOLUTION]);
    stub.setWorkspaces([WORKSPACE_WITH_EMPTY_FILTERS]);
    stub.setDatasets([...DATASETS]);
  });
  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' }));
  after(stub.stop);

  it('shows no subdatasources', () => {
    const DATASET_A = DATASETS[0];
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.selectDatasetById(DATASET_A.id);
    DatasetManager.startSubdatasetCreation();
    DatasetManager.getDatasetCreationNextStep().click();
    DatasetManager.getNewDatasetSourceTypeSelect().click();
    DatasetManager.getNewDatasetSourceTypeOptions().should('have.length', 0);
  });
});

describe('Subdatasets creation', () => {
  before(() => {
    stub.start();
    stub.setOrganizations([ORGANIZATION_WITH_DEFAULT_ROLE_USER]);
    stub.setSolutions([SOLUTION]);
    stub.setWorkspaces([WORKSPACE]);
    stub.setDatasets([...DATASETS]);
  });
  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' }));
  after(stub.stop);

  it('can create a subdataset as a child of the selected dataset', () => {
    const DATASET_A = DATASETS[0];
    const SUBDATASET_ID = 'd-stbdsubdst00';
    const SUBDATASET_NAME = forgeSubdatasetNameFromParentName(DATASET_A.name);
    const RUNNER_ID = 'r-stbdrunnr00';

    const expectedDatasetCreationPayload = {
      name: SUBDATASET_NAME,
      parentId: DATASET_A.id,
      ownerName: DATASET_A.ownerName,
      tags: DATASET_A.tags,
      description: DATASET_A.description,
      sourceType: 'ETL',
      security: { default: 'none', accessControlList: [{ id: 'dev.sample.webapp@example.com', role: 'admin' }] },
      source: { location: WORKSPACE.id, name: RUNNER_ID },
    };
    const validateDatasetCreationRequest = (req) => expect(req.body).to.deep.equal(expectedDatasetCreationPayload);

    const expectedRunnerCreationPayload = {
      name: SUBDATASET_NAME,
      tags: DATASET_A.tags,
      description: DATASET_A.description,
      datasetList: [DATASET_A.id],
      parametersValues: [],
      security: { default: 'none', accessControlList: [{ id: 'dev.sample.webapp@example.com', role: 'admin' }] },
      runTemplateId: 'no_filter',
    };
    const validateRunnerCreationRequest = (req) => expect(req.body).to.deep.equal(expectedRunnerCreationPayload);

    const expectedRunnerPatchPayload = { runTemplateId: 'no_filter', datasetList: [SUBDATASET_ID, DATASET_A.id] };
    const validateRunnerPatchRequest = (req) => expect(req.body).to.deep.equal(expectedRunnerPatchPayload);

    const subdatasetIngestionOptions = {
      expectedPollsCount: 2,
      finalIngestionStatus: 'SUCCESS',
    };

    DatasetManager.switchToDatasetManagerView();
    DatasetManager.getDatasetsListItemButton(DATASET_A.id).should('be.visible');
    DatasetManager.selectDatasetById(DATASET_A.id);
    DatasetManager.getDatasetMetadataParent().should('not.exist');
    DatasetManager.getCreateSubdatasetButton().should('be.visible');
    DatasetManager.startSubdatasetCreation();

    // Check metadata inherited from parent dataset (name, tags, description)
    DatasetManager.getParentNameSubtitle().should('contain', DATASET_A.name);
    DatasetManager.getNewDatasetNameInput().should('value', SUBDATASET_NAME);
    DATASET_A.tags.forEach((tag, index) => DatasetManager.getNewDatasetTag(index).should('contain', tag));
    DatasetManager.getNewDatasetDescription().should('contain', DATASET_A.description);

    // Check subdatasources in wizard 2nd step
    DatasetManager.getDatasetCreationNextStep().click();
    DatasetManager.getNewDatasetSourceTypeSelect().click();
    DatasetManager.getNewDatasetSourceTypeOption('no_filter').should('be.visible').click();
    DatasetManager.confirmDatasetCreation({
      id: SUBDATASET_ID,
      importJobOptions: subdatasetIngestionOptions,
      isETL: true,
      validateRequest: validateDatasetCreationRequest,
      runnerCreationOptions: { id: RUNNER_ID, validateRequest: validateRunnerCreationRequest },
      runnerUpdateOptions: { validateRequest: validateRunnerPatchRequest },
    });

    // Check new dataset is automatically selected after creation, and that parent name is visible
    DatasetManager.getDatasetNameInOverview(10).should('have.text', SUBDATASET_NAME);
    DatasetManager.getDatasetMetadataParent().should('contain', DATASET_A.name);
  });

  it('must show the parameter input fields associated to the selected data source', () => {
    const DATASET_A = DATASETS[0];
    const stringParameterSelector = '[data-cy=text-input-etl_string_parameter]';
    const stringValue = 'test string value';
    const enumParameterSelector = '[data-cy=enum-input-select-etl_enum_parameter]';
    const enumOption2Selector = '[data-cy=option2]';
    const enumValue1 = 'Option 1';
    const enumValue2 = 'Option 2';
    const listParameterSelector = '[data-cy=multi-input-etl_list_parameter]';
    const listOption2Selector = '[data-option-index=1]';
    const listValue1 = 'Option 1';
    const listValue2 = 'Option 2';
    const dateParameterSelector = '[data-cy=date-input-etl_date_parameter]';
    const dateValue = '01/01/2023';

    DatasetManager.switchToDatasetManagerView();
    DatasetManager.selectDatasetById(DATASET_A.id);
    DatasetManager.startSubdatasetCreation();
    DatasetManager.getDatasetCreationNextStep().click();

    // Check that only parameters of the subdatasource are shown, and that user input is possible
    DatasetManager.selectNewDatasetSourceType('no_filter');
    cy.get(stringParameterSelector).should('not.exist');
    cy.get(enumParameterSelector).should('not.exist');
    cy.get(listParameterSelector).should('not.exist');
    cy.get(dateParameterSelector).should('not.exist');

    DatasetManager.selectNewDatasetSourceType('string_filter');
    cy.get(stringParameterSelector).should('be.visible').click();
    cy.get(stringParameterSelector).type('test string value');
    cy.get(enumParameterSelector).should('not.exist');
    cy.get(listParameterSelector).should('not.exist');
    cy.get(dateParameterSelector).should('not.exist');

    DatasetManager.selectNewDatasetSourceType('enum_filter');
    cy.get(stringParameterSelector).should('not.exist');
    cy.get(enumParameterSelector).should('be.visible').click();
    cy.get(dateParameterSelector).should('not.exist');
    cy.get(enumOption2Selector).click();
    cy.get(listParameterSelector).should('not.exist');

    DatasetManager.selectNewDatasetSourceType('list_filter');
    cy.get(stringParameterSelector).should('not.exist');
    cy.get(enumParameterSelector).should('not.exist');
    cy.get(listParameterSelector).should('be.visible').click();
    cy.get(dateParameterSelector).should('not.exist');
    cy.get(listOption2Selector).click();

    DatasetManager.selectNewDatasetSourceType('date_filter');
    cy.get(stringParameterSelector).should('not.exist');
    cy.get(enumParameterSelector).should('not.exist');
    cy.get(listParameterSelector).should('not.exist');
    cy.get(dateParameterSelector).should('be.visible').click();
    cy.get(dateParameterSelector).find('input').click();
    cy.get(dateParameterSelector)
      .find('input')
      .type('{moveToStart}' + dateValue);

    // Check that prior inputs remain when switching back to previous datasources
    DatasetManager.selectNewDatasetSourceType('no_filter');

    DatasetManager.selectNewDatasetSourceType('string_filter');
    cy.get(stringParameterSelector).should('be.visible').find('input').should('value', stringValue);

    DatasetManager.selectNewDatasetSourceType('enum_filter');
    cy.get(enumParameterSelector).should('be.visible').should('not.contain', enumValue1);
    cy.get(enumParameterSelector).should('be.visible').should('contain', enumValue2);

    DatasetManager.selectNewDatasetSourceType('list_filter');
    cy.get(listParameterSelector).should('be.visible').should('not.contain', listValue1);
    cy.get(listParameterSelector).should('be.visible').should('contain', listValue2);

    DatasetManager.selectNewDatasetSourceType('date_filter');
    cy.get(dateParameterSelector).should('be.visible').find('input').should('have.value', dateValue);
  });
});
