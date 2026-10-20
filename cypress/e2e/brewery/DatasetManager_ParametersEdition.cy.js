// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, DatasetManager, RunTemplateParameters, TableParameters } from '../../commons/actions';
import { GENERIC_SELECTORS } from '../../commons/constants/generic/IdConstants';
import { stub } from '../../commons/services/stubbing';
import { apiUtils } from '../../commons/utils';
import {
  DATASETS,
  RUNNERS,
  SOLUTION,
  SOLUTION_WITH_TABLE_PARAMETER,
  WORKSPACE,
} from '../../fixtures/stubbing/DatasetManagerParametersEdition';
import { DEFAULT_ORGANIZATION } from '../../fixtures/stubbing/default';

const NINE_CUSTOMERS_DATASET_ZIP_FILE_PATH = 'customers2.csv';

const datasetFile = DATASETS[2];
const datasetETLDynamicValues = DATASETS[3];
const datasetETLLocalFile = DATASETS[4];
const secondDatasetETLLocalFile = DATASETS[6];
const enumParameterSelector = '[data-cy=enum-input-select-etl_dynamic_values_enum_parameter]';
const enumValue1Selector = '[data-cy=First]';
const fileParameterSelector = '[data-cy="file-upload-etl_file_parameter"]';
const stockParameterSelector = '[data-cy=text-input-etl_stock]';

// Response must be in CSV format as the API returns CSV data
// The column name must match the resultKey in the solution parameter's dynamicEnumValues config
const queryResponse = 'customer_id\nFirst\nSecond\nThird';

const getStockParameterInput = () => cy.get(stockParameterSelector).find('input');
const clearStockParameterInput = () => getStockParameterInput().click().type('{selectAll}{backspace}');
const editStockParameter = (value) => {
  clearStockParameterInput();
  getStockParameterInput().type(value);
};

describe('Dataset Manager - Parameters Edition', () => {
  const ingestionOptions = { expectedPollsCount: 2, finalIngestionStatus: 'SUCCESS' };
  before(() => {
    stub.start();
    stub.setOrganizations([DEFAULT_ORGANIZATION]);
    stub.setWorkspaces([WORKSPACE]);
    stub.setDatasets([...DATASETS]);
    stub.setRunners([...RUNNERS]);
    stub.setDatasetPartFiles({ 'dp-etlTable1': 'name\nOriginal customer' });
  });

  after(stub.stop);

  describe('existing ETL parameters', () => {
    beforeEach(() => {
      stub.setSolutions([SOLUTION]);
      Login.login({ url: `/${WORKSPACE.id}/datasetmanager`, workspaceId: WORKSPACE.id, isPowerBiEnabled: false });
    });

    it('should edit ETL parameters of a dataset', () => {
      DatasetManager.ignoreDatasetQueries();
      DatasetManager.switchToDatasetManagerView();
      DatasetManager.selectDatasetById(datasetFile.id);
      DatasetManager.getUpdateDatasetParametersButton().should('not.exist');
      DatasetManager.selectDatasetById(datasetETLDynamicValues.id);
      DatasetManager.getUpdateDatasetParametersButton().should('be.visible');
      const waitForDatasetQuery = DatasetManager.expectDatasetQuery(queryResponse);
      DatasetManager.openUpdateDatasetParametersDialog();
      DatasetManager.getUpdateDatasetParametersDialog().should('be.visible');
      DatasetManager.getRunnerRunTemplate().should('exist').contains('ETL with dynamic values');
      waitForDatasetQuery();
      cy.get(enumParameterSelector).should('be.visible');
      cy.get(enumParameterSelector).find('input').should('have.value', 'Second');
      cy.get(enumParameterSelector).click();
      cy.get(enumValue1Selector).click();
      cy.get(enumParameterSelector).find('input').should('have.value', 'First');
      cy.log(datasetETLDynamicValues);
      DatasetManager.updateDatasetParameters(datasetETLDynamicValues.id, { importJobOptions: ingestionOptions });
      DatasetManager.getRefreshDatasetSpinner(datasetETLDynamicValues.id, 20).should('not.exist');
      DatasetManager.selectDatasetById(secondDatasetETLLocalFile.id);
      DatasetManager.getUpdateDatasetParametersButton().should('be.visible');
      DatasetManager.openUpdateDatasetParametersDialog();
      DatasetManager.getRunnerRunTemplate().should('exist').contains('ETL with local file');
      cy.get(fileParameterSelector)
        .find(GENERIC_SELECTORS.genericComponents.uploadFile.fileName)
        .should('have.text', 'reference_two.zip');
      getStockParameterInput().should('have.value', '56');
      DatasetManager.closeUpdateDatasetParametersDialog();
      DatasetManager.selectDatasetById(datasetETLLocalFile.id);
      DatasetManager.getUpdateDatasetParametersButton().should('be.visible');
      DatasetManager.openUpdateDatasetParametersDialog();
      DatasetManager.getRunnerRunTemplate().should('exist').contains('ETL with local file');
      cy.get(fileParameterSelector)
        .find(GENERIC_SELECTORS.genericComponents.uploadFile.fileName)
        .should('have.text', 'reference.zip');
      getStockParameterInput().should('have.value', '150');
      DatasetManager.getUpdateParametersButton().should('be.disabled');
      clearStockParameterInput();
      DatasetManager.getUpdateParametersButton().should('be.disabled');
      editStockParameter('150');
      DatasetManager.getUpdateParametersButton().should('be.disabled');
      cy.get(stockParameterSelector).find('input').click();
      editStockParameter('98');
      DatasetManager.getUpdateParametersButton().should('not.be.disabled');
      DatasetManager.uploadFileInParametersEditionDialog(NINE_CUSTOMERS_DATASET_ZIP_FILE_PATH);

      DatasetManager.updateDatasetParameters(datasetETLLocalFile.id, {
        datasetPartEvents: [{ id: 'dp-newEtlFile1' }, { id: 'dp-etlFile1', delete: true }],
        importJobOptions: ingestionOptions,
      });

      DatasetManager.getRefreshDatasetSpinner(datasetETLLocalFile.id, 20).should('not.exist');
      DatasetManager.selectDatasetById(datasetETLDynamicValues.id);
      const waitForSecondDatasetQuery = DatasetManager.expectDatasetQuery(queryResponse);
      DatasetManager.openUpdateDatasetParametersDialog();
      waitForSecondDatasetQuery();
      cy.get(enumParameterSelector).find('input').should('have.value', 'First');
      DatasetManager.closeUpdateDatasetParametersDialog();
      DatasetManager.selectDatasetById(datasetETLLocalFile.id);
      DatasetManager.openUpdateDatasetParametersDialog();
      getStockParameterInput().should('have.value', '98');
      cy.get(fileParameterSelector)
        .find(GENERIC_SELECTORS.genericComponents.uploadFile.fileName)
        .should('have.text', 'customers2.csv');
      DatasetManager.closeUpdateDatasetParametersDialog();
    });
  });

  describe('table parameter edition', () => {
    beforeEach(() => {
      stub.setSolutions([SOLUTION_WITH_TABLE_PARAMETER]);
      Login.login({ url: `/${WORKSPACE.id}/datasetmanager`, workspaceId: WORKSPACE.id, isPowerBiEnabled: false });
    });

    it('should edit the table parameter of an existing dataset', () => {
      const getTableParameter = () => RunTemplateParameters.getTableContainer('etl_table_parameter');

      DatasetManager.ignoreDatasetQueries();
      DatasetManager.switchToDatasetManagerView();
      DatasetManager.selectDatasetById(datasetETLLocalFile.id);
      apiUtils.interceptDownloadDatasetPart({ datasetId: 'd-stbdParameterDataset', datasetPartId: 'dp-etlTable1' });
      DatasetManager.openUpdateDatasetParametersDialog();
      DatasetManager.getRunnerRunTemplate().should('exist').contains('ETL with table parameter');
      TableParameters.getLoadingSpinner(getTableParameter()).should('not.exist');
      TableParameters.getCell(getTableParameter(), 'name', 0).should('have.text', 'Original customer');
      TableParameters.editStringCell(getTableParameter, 'name', 0, 'Updated customer');
      TableParameters.getCell(getTableParameter(), 'name', 0).should('have.text', 'Updated customer');

      DatasetManager.updateDatasetParameters(datasetETLLocalFile.id, {
        datasetPartEvents: [{ id: 'dp-newEtlTable1' }, { id: 'dp-etlTable1', delete: true }],
        importJobOptions: ingestionOptions,
      });
      DatasetManager.getRefreshDatasetSpinner(datasetETLLocalFile.id, 20).should('not.exist');

      apiUtils.interceptDownloadDatasetPart({ datasetId: 'd-stbdParameterDataset', datasetPartId: 'dp-newEtlTable1' });
      DatasetManager.openUpdateDatasetParametersDialog();
      TableParameters.getLoadingSpinner(getTableParameter()).should('not.exist');
      TableParameters.getCell(getTableParameter(), 'name', 0).should('have.text', 'Updated customer');
    });
  });
});
