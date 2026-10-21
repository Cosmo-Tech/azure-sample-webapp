// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, DatasetManager, RunTemplateParameters, TableParameters } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { DATASETS, WORKSPACE } from '../../fixtures/stubbing/DatasetManager';
import { DEFAULT_ORGANIZATION, DEFAULT_SOLUTION } from '../../fixtures/stubbing/default';

const DYNAMIC_TABLE_PARAMETER = {
  id: 'dynamic_values_customers_table',
  labels: { en: 'Customers' },
  varType: '%DATASET_PART_ID_FILE%',
  additionalData: {
    subType: 'TABLE',
    dynamicValues: { datasetPartName: 'customers', options: { selects: 'id,name' } },
    columns: [
      { field: 'id', type: ['string'] },
      { field: 'name', type: ['string'] },
    ],
  },
};

const DYNAMIC_TABLE_PARAMETER_GROUP = {
  id: 'dynamic_values_customers_table_group',
  parameters: [DYNAMIC_TABLE_PARAMETER.id],
};

const DYNAMIC_TABLE_SUBDATASOURCE = {
  id: 'dynamic_values_table_filter',
  tags: ['subdatasource'],
  parameterGroups: [DYNAMIC_TABLE_PARAMETER_GROUP.id],
};

const SOLUTION_WITH_DYNAMIC_TABLE = {
  ...DEFAULT_SOLUTION,
  parameters: [...DEFAULT_SOLUTION.parameters, DYNAMIC_TABLE_PARAMETER],
  parameterGroups: [...DEFAULT_SOLUTION.parameterGroups, DYNAMIC_TABLE_PARAMETER_GROUP],
  runTemplates: [...DEFAULT_SOLUTION.runTemplates, DYNAMIC_TABLE_SUBDATASOURCE],
};

describe('Subdatasets creation', () => {
  before(() => {
    stub.start();
    stub.setOrganizations([DEFAULT_ORGANIZATION]);
    stub.setWorkspaces([WORKSPACE]);
    stub.setDatasets([...DATASETS]);
    stub.setSolutions([SOLUTION_WITH_DYNAMIC_TABLE]);
  });
  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' }));
  after(stub.stop);

  it('must show the parameter input fields associated to the selected data source', () => {
    const DATASET_A = DATASETS[0];
    const enumParameterSelector = '[data-cy=enum-input-select-dynamic_values_customers_enum]';
    const enumOption2Selector = '[data-cy="Dynamic value 2"]';
    const selectorForAllEnumOptions = '[data-cy^="Dynamic value"]';

    const validateRequest = (req) => expect(req.url).to.include('selects=id');
    const queryResponse = 'id\nDynamic value 1\nDynamic value 2\nDynamic value 3';

    DatasetManager.ignoreDatasetQueries();
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.selectDatasetById(DATASET_A.id);
    DatasetManager.startSubdatasetCreation();

    // The query interception below overrides the previous interception ignoring all queries, but only for the next one
    const waitForDatasetQuery = DatasetManager.expectDatasetQuery(queryResponse, validateRequest);
    DatasetManager.getDatasetCreationNextStep().click();
    DatasetManager.selectNewDatasetSourceType('dynamic_values_enum_filter');
    waitForDatasetQuery();

    cy.get(enumParameterSelector).should('be.visible').click();
    cy.get(selectorForAllEnumOptions).should('have.length', 3);
    cy.get(enumOption2Selector).click();
  });

  it('must populate a table parameter with dynamic values when creating a subdataset', () => {
    const DATASET_A = DATASETS[0];
    const getTableParameter = () => RunTemplateParameters.getTableContainer(DYNAMIC_TABLE_PARAMETER.id);
    const queryResponse = 'id,name\ncustomer-1,Customer 1\ncustomer-2,Customer 2';

    DatasetManager.ignoreDatasetQueries();
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.selectDatasetById(DATASET_A.id);
    DatasetManager.startSubdatasetCreation();
    DatasetManager.getDatasetCreationNextStep().click();

    const waitForDatasetQuery = DatasetManager.expectDatasetQuery(queryResponse, (req) =>
      expect(req.url).to.include('selects=id%2Cname')
    );
    DatasetManager.selectNewDatasetSourceType(DYNAMIC_TABLE_SUBDATASOURCE.id);
    waitForDatasetQuery();

    TableParameters.getHeaderCell(getTableParameter(), 'id').should('be.visible');
    TableParameters.getHeaderCell(getTableParameter(), 'name').should('be.visible');
    TableParameters.getCell(getTableParameter(), 'id', 0).should('have.text', 'customer-1');
    TableParameters.getCell(getTableParameter(), 'name', 0).should('have.text', 'Customer 1');
    TableParameters.getCell(getTableParameter(), 'id', 1).should('have.text', 'customer-2');
    TableParameters.getCell(getTableParameter(), 'name', 1).should('have.text', 'Customer 2');
  });
});
