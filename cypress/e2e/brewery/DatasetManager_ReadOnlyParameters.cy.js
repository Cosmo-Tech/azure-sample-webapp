// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import rfdc from 'rfdc';
import {
  DatasetManager,
  FileParameters,
  Login,
  RunTemplateParameters as RTParams,
  ScenarioParameters,
  TableParameters,
} from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { apiUtils } from '../../commons/utils';
import {
  DATASETS,
  DYNAMIC_QUERY_RESPONSE,
  DYNAMIC_TABLE_QUERY_RESPONSE,
  READ_ONLY_SUBDATASOURCE_RUN_TEMPLATE,
  RUNNERS,
  SOLUTION,
} from '../../fixtures/stubbing/ReadOnlyParameters';
import {
  DEFAULT_ETL_RUNNER,
  DEFAULT_SIMULATION_RUNNER,
  WORKSPACE_WITH_DATASET_MANAGER,
} from '../../fixtures/stubbing/default';

const clone = rfdc();

const SOLUTION_WITH_ETL = clone(SOLUTION);
const ETL_RUN_TEMPLATE = SOLUTION_WITH_ETL.runTemplates[0];
ETL_RUN_TEMPLATE.tags = ['datasource'];

const assertReadOnlyParameter = (componentId, expectedValue) => {
  const parameter = RTParams.getParameterContainer(componentId);
  ScenarioParameters.getParameterValue(componentId).should('be.visible').and('have.text', expectedValue);
  parameter.find('input').should('not.exist');
};

const assertReadOnlyParameters = ({ dynamicValuesHaveErrors, dynamicNumberValue }) => {
  [
    ['toggle-input-readonly_bool', 'ON'],
    ['date-input-readonly_date', '1/1/2025'],
    ['enum-input-readonly_enum', 'Option A'],
    ['radio-input-readonly_enum_radio', 'Option B'],
    ['single-select-readonly_enum_scenarios', 'No scenario selected'],
  ].forEach(([componentId, expectedValue]) => assertReadOnlyParameter(componentId, expectedValue));

  [
    ['multi-input-readonly_list', 'France, India'],
    ['number-input-readonly_number', '42'],
    ['slider-input-readonly_number_slider', '50'],
    ['number-input-readonly_int', '7'],
    ['text-input-readonly_string', 'Read-only example'],
  ].forEach(([componentId, expectedValue]) => assertReadOnlyParameter(componentId, expectedValue));

  const errorAssertion = dynamicValuesHaveErrors ? 'be.visible' : 'not.exist';
  ScenarioParameters.getDynamicParameterValueError('readonly_dynamic_enum').should(errorAssertion);
  ScenarioParameters.getDynamicParameterValueError('readonly_dynamic_list').should(errorAssertion);
  ScenarioParameters.getDynamicValueErrorIcon('readonly_dynamic_number').should(errorAssertion);
  ScenarioParameters.getDynamicValueErrorIcon('readonly_dynamic_int').should(errorAssertion);

  [
    ['number-input-readonly_dynamic_number', dynamicNumberValue],
    ['number-input-readonly_dynamic_int', dynamicNumberValue],
  ].forEach(([componentId, expectedValue]) => assertReadOnlyParameter(componentId, expectedValue));

  const getFileParameter = () => RTParams.getFileContainer('readonly_file');
  FileParameters.getBrowseButton(getFileParameter()).should('not.exist');
  FileParameters.getDeleteButton(getFileParameter()).should('not.exist');

  const getStaticTable = () => RTParams.getTableContainer('readonly_table_events');
  const getDynamicTable = () => RTParams.getTableContainer('readonly_dynamic_table_customers');
  [getStaticTable, getDynamicTable].forEach((getTable) => {
    TableParameters.getImportButton(getTable()).should('have.class', 'Mui-disabled');
    TableParameters.getAddRowButton(getTable()).should('not.exist');
    TableParameters.getDeleteRowsButton(getTable()).should('not.exist');
  });
};

describe('Dataset Manager - Read-only Parameters', () => {
  const workspaceId = WORKSPACE_WITH_DATASET_MANAGER.id;

  before(() => {
    stub.start();
    stub.setSolutions([SOLUTION_WITH_ETL]);
    stub.setWorkspaces([WORKSPACE_WITH_DATASET_MANAGER]);
    stub.setDatasets(DATASETS);
    stub.setRunners([DEFAULT_ETL_RUNNER, DEFAULT_SIMULATION_RUNNER, ...RUNNERS]);
  });

  beforeEach(() => {
    apiUtils.interceptPostDatasetQuery(DYNAMIC_TABLE_QUERY_RESPONSE, null, 1);
    apiUtils.interceptPostDatasetQuery(DYNAMIC_QUERY_RESPONSE, null, 4);
    Login.login({ url: `/${workspaceId}/datasetmanager`, workspaceId });
  });

  after(stub.stop);

  it('displays ETL parameter values without allowing edits when creating a new dataset', () => {
    DatasetManager.switchToDatasetManagerView([], { interceptDatasetQueries: false });
    DatasetManager.startDatasetCreation();
    DatasetManager.setNewDatasetName('Cypress - DatasetManager_ReadOnlyParameters');
    DatasetManager.getDatasetCreationNextStep().click();
    DatasetManager.selectNewDatasetSourceType(ETL_RUN_TEMPLATE.id);

    assertReadOnlyParameters({ dynamicValuesHaveErrors: true, dynamicNumberValue: '0' });
  });

  it('displays ETL parameter values without errors or allowing edits when creating a new sub-dataset', () => {
    const parentDataset = DATASETS.find((dataset) => dataset.parts.some((part) => part.name === 'Customer'));

    DatasetManager.switchToDatasetManagerView([], { interceptDatasetQueries: false });
    DatasetManager.selectDatasetById(parentDataset.id);
    DatasetManager.startSubdatasetCreation();
    DatasetManager.getDatasetCreationNextStep().click();
    DatasetManager.selectNewDatasetSourceType(READ_ONLY_SUBDATASOURCE_RUN_TEMPLATE.id);

    assertReadOnlyParameters({ dynamicValuesHaveErrors: false, dynamicNumberValue: '3' });
  });
});
