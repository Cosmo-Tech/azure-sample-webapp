// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import {
  FileParameters,
  Login,
  ScenarioParameters,
  ScenarioSelector,
  Scenarios,
  TableParameters,
} from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { apiUtils } from '../../commons/utils';
import {
  DATASETS,
  DYNAMIC_QUERY_RESPONSE,
  DYNAMIC_TABLE_QUERY_RESPONSE,
  FILE_CONTENT,
  FILE_PARAMETER_PART_ID,
  RUNNERS,
  SOLUTION,
  STATIC_TABLE_CONTENT,
  STATIC_TABLE_PART_ID,
} from '../../fixtures/stubbing/ReadOnlyParameters';

const FILE_PARAMETER_ID = 'readonly_file';
const STATIC_TABLE_ID = 'readonly_table_events';
const DYNAMIC_TABLE_ID = 'readonly_dynamic_table_customers';

const assertReadOnlyParameter = (componentId, expectedValue) => {
  const parameter = ScenarioParameters.getParameterContainer(componentId);
  ScenarioParameters.getParameterValue(componentId).should('be.visible').and('have.text', expectedValue);
  parameter.find('input').should('not.exist');
};

const selectParameterGroup = (groupId) => cy.get(`[data-cy=${groupId}_tab]`).click();

describe('read-only scenario parameters', () => {
  before(() => stub.start());

  beforeEach(() => {
    stub.reset();
    stub.setDatasets(DATASETS);
    stub.setSolutions([SOLUTION]);
    stub.setRunners(RUNNERS);
    stub.addDatasetPartFile(FILE_PARAMETER_PART_ID, FILE_CONTENT);
    stub.addDatasetPartFile(STATIC_TABLE_PART_ID, STATIC_TABLE_CONTENT);

    // Note: the "times" of interception does not seem to be always reliable for multiple fast successive queries
    // (e.g. times=1 migth still let 4 consecutive queries being intercepted)
    apiUtils.interceptPostDatasetQuery(DYNAMIC_TABLE_QUERY_RESPONSE, null, 1);
    apiUtils.interceptPostDatasetQuery(DYNAMIC_QUERY_RESPONSE, null, 4);

    apiUtils.interceptDownloadDatasetPart({
      datasetPartId: FILE_PARAMETER_PART_ID,
      fileContent: FILE_CONTENT,
    });
    apiUtils.interceptDownloadDatasetPart({
      datasetPartId: STATIC_TABLE_PART_ID,
      fileContent: STATIC_TABLE_CONTENT,
    });

    Login.login();
  });

  afterEach(() => stub.reset());
  after(() => stub.stop());

  it('displays default and dynamic values without allowing parameter edits', () => {
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioSelector.selectScenario(RUNNERS[0].name, RUNNERS[0].id);
    ScenarioParameters.expandParametersAccordion();

    [
      ['toggle-input-readonly_bool', 'ON'],
      ['date-input-readonly_date', '1/1/2025'],
      ['enum-input-readonly_enum', 'Option A'],
      ['radio-input-readonly_enum_radio', 'Option B'],
      ['single-select-readonly_enum_scenarios', 'No scenario selected'],
    ].forEach(([componentId, expectedValue]) => assertReadOnlyParameter(componentId, expectedValue));

    selectParameterGroup('readonly_additional_basic_types');
    [
      ['multi-input-readonly_list', 'France, India'],
      ['number-input-readonly_number', '42'],
      ['slider-input-readonly_number_slider', '50'],
      ['number-input-readonly_int', '7'],
      ['text-input-readonly_string', 'Read-only example'],
    ].forEach(([componentId, expectedValue]) => assertReadOnlyParameter(componentId, expectedValue));

    selectParameterGroup('readonly_dynamic_values');
    [
      ['enum-input-readonly_dynamic_enum', 'Customer1'],
      ['multi-input-readonly_dynamic_list', 'No selected values'],
      ['number-input-readonly_dynamic_number', '3'],
      ['number-input-readonly_dynamic_int', '3'],
    ].forEach(([componentId, expectedValue]) => assertReadOnlyParameter(componentId, expectedValue));

    selectParameterGroup('readonly_files');
    const getFileParameter = () => ScenarioParameters.getParameterContainer(`file-upload-${FILE_PARAMETER_ID}`);
    FileParameters.getFileName(getFileParameter()).should('have.text', 'read_only_file.csv');
    FileParameters.getDownloadButton(getFileParameter()).should('be.visible');
    FileParameters.getBrowseButton(getFileParameter()).should('not.exist');
    FileParameters.getDeleteButton(getFileParameter()).should('not.exist');

    selectParameterGroup('readonly_tables');
    const getStaticTable = () => ScenarioParameters.getParameterContainer(`table-${STATIC_TABLE_ID}`);
    const getDynamicTable = () => ScenarioParameters.getParameterContainer(`table-${DYNAMIC_TABLE_ID}`);

    TableParameters.getLoadingSpinner(getStaticTable()).should('not.exist');

    TableParameters.getRows(getStaticTable()).should('have.length', 1);
    TableParameters.getCell(getStaticTable(), 'theme', 0).should('have.text', 'Tasting').dblclick();
    TableParameters.getCell(getStaticTable(), 'theme', 0).find('input').should('not.exist');
    TableParameters.getCell(getStaticTable(), 'theme', 0).should('have.text', 'Tasting');
    TableParameters.getImportButton(getStaticTable()).should('have.class', 'Mui-disabled');
    TableParameters.getAddRowButton(getStaticTable()).should('not.exist');
    TableParameters.getDeleteRowsButton(getStaticTable()).should('not.exist');

    TableParameters.getLoadingSpinner(getDynamicTable()).should('not.exist');
    TableParameters.getRows(getDynamicTable()).should('have.length', 3);
    TableParameters.getCell(getDynamicTable(), 'id', 0).should('have.text', 'Customer1').dblclick();
    TableParameters.getCell(getDynamicTable(), 'id', 0).find('input').should('not.exist');
    TableParameters.getCell(getDynamicTable(), 'id', 0).should('have.text', 'Customer1');
    TableParameters.getImportButton(getDynamicTable()).should('have.class', 'Mui-disabled');
    TableParameters.getAddRowButton(getDynamicTable()).should('not.exist');
    TableParameters.getDeleteRowsButton(getDynamicTable()).should('not.exist');
    TableParameters.getRevertDataButton(getDynamicTable()).should('have.class', 'Mui-disabled');
  });
});
