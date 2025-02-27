// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, DatasetManager } from '../../commons/actions';
import { GENERIC_SELECTORS } from '../../commons/constants/generic/IdConstants';
import { stub } from '../../commons/services/stubbing';
import { ORGANIZATION_WITH_DEFAULT_ROLE_USER } from '../../fixtures/stubbing/DatasetManager';
import { DATASETS, RUNNERS, SOLUTION, WORKSPACE } from '../../fixtures/stubbing/DatasetManagerParametersEdition';

const NINE_CUSTOMERS_DATASET_ZIP_FILE_PATH = 'customers2.csv';

describe('Dataset Manager - Parameters Edition', () => {
  const ingestionOptions = {
    expectedPollsCount: 2,
    finalIngestionStatus: 'SUCCESS',
  };
  before(() => {
    stub.start();
    stub.setOrganizations([ORGANIZATION_WITH_DEFAULT_ROLE_USER]);
    stub.setSolutions([SOLUTION]);
    stub.setWorkspaces([WORKSPACE]);
    stub.setDatasets([...DATASETS]);
    stub.setRunners([...RUNNERS]);
  });

  beforeEach(() =>
    Login.login({ url: `/${WORKSPACE.id}/datasetmanager`, workspaceId: WORKSPACE.id, isPowerBiEnabled: false })
  );
  after(stub.stop);

  it('should edit ETL parameters of a dataset', () => {
    const datasetFile = DATASETS[2];
    const datasetETLDynamicValues = DATASETS[3];
    const datasetETLLocalFile = DATASETS[4];
    const secondDatasetETLLocalFile = DATASETS[6];
    const enumParameterSelector = '[data-cy=enum-input-select-etl_dynamic_values_enum_parameter]';
    const enumValue1Selector = '[data-cy=First]';
    const fileParameterSelector = '[data-cy="file-upload-etl_file_parameter"]';
    const stockParameterSelector = '[data-cy=text-input-etl_stock]';
    const getStockParameterInput = () => {
      return cy.get(stockParameterSelector).find('input');
    };
    const clearStockParameterInput = () => {
      getStockParameterInput().click().type('{selectAll}{backspace}');
    };
    const editStockParameter = (value) => {
      clearStockParameterInput();
      getStockParameterInput().type(value);
    };

    const validateRequest = (req) =>
      expect(req.body).to.deep.equal({ query: 'MATCH(n:Customer) RETURN n.id as customer_id' });
    const queryResponse = [{ customer_id: 'First' }, { customer_id: 'Second' }, { customer_id: 'Third' }];

    DatasetManager.ignoreDatasetTwingraphQueries();
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.selectDatasetById(datasetFile.id);
    DatasetManager.getUpdateDatasetParametersButton().should('not.exist');
    DatasetManager.selectDatasetById(datasetETLDynamicValues.id);
    DatasetManager.getUpdateDatasetParametersButton().should('be.visible');
    const waitForTwingraphQuery = DatasetManager.expectDatasetTwingraphQuery(queryResponse, validateRequest);
    DatasetManager.openUpdateDatasetParametersDialog();
    DatasetManager.getUpdateDatasetParametersDialog().should('be.visible');
    DatasetManager.getRunnerRunTemplate().should('exist').contains('ETL with dynamic values');
    waitForTwingraphQuery();
    cy.get(enumParameterSelector).should('be.visible');
    cy.get(enumParameterSelector).find('input').should('have.value', 'Second');
    cy.get(enumParameterSelector).click();
    cy.get(enumValue1Selector).click();
    cy.get(enumParameterSelector).find('input').should('have.value', 'First');
    DatasetManager.updateDatasetParameters(datasetETLDynamicValues.id, {
      importJobOptions: ingestionOptions,
    });
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
      datasetsEvents: [{ id: 'd-stbddtspr1' }],
      importJobOptions: ingestionOptions,
    });
    DatasetManager.getRefreshDatasetSpinner(datasetETLLocalFile.id, 20).should('not.exist');
    DatasetManager.selectDatasetById(datasetETLDynamicValues.id);
    DatasetManager.openUpdateDatasetParametersDialog();
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
