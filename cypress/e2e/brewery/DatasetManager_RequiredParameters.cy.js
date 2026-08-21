// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import {
  Login,
  DatasetManager,
  RunTemplateParameters as RTParams,
  ScenarioParameters,
  TableParameters,
} from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import {
  SOLUTION,
  REQUIRED_ENABLED_WITH_INCONSISTENT_CONFIG_RUN_TEMPLATE,
  NOT_IMPACTED_BY_REQUIRED_RUN_TEMPLATE,
  SCENARIO_REQUIRED_TRUE_RUN_TEMPLATE,
  NUMBER_REQUIRED_TRUE_RUN_TEMPLATE,
  INT_REQUIRED_TRUE_RUN_TEMPLATE,
  STRING_REQUIRED_TRUE_RUN_TEMPLATE,
  STRING_REQUIRED_UNDEFINED_MIN_LENGTH_1_RUN_TEMPLATE,
  FILE_REQUIRED_TRUE_RUN_TEMPLATE,
  TABLE_REQUIRED_TRUE_RUN_TEMPLATE,
  REQUIRED_DISABLED_IN_CONFIG_RUN_TEMPLATE,
  REQUIRED_BY_DEFAULT_RUN_TEMPLATE,
} from '../../fixtures/stubbing/DatasetManager_RequiredParameters';
import {
  WORKSPACE_WITH_DATASET_MANAGER,
  DEFAULT_RUNNER_BASE_DATASET,
  DEFAULT_RUNNER_PARAMETER_DATASET,
  DEFAULT_ETL_RUNNER,
  DEFAULT_SIMULATION_RUNNER,
} from '../../fixtures/stubbing/default';

const NINE_CUSTOMERS_DATASET_ZIP_FILE_PATH = 'customers2.csv';

const startETLDatasetCreation = (datasourceName) => {
  // "Fast-forward" helper function to create a new dataset with the provided datasource and land on the parameter
  // edition screen
  DatasetManager.startDatasetCreation();
  DatasetManager.setNewDatasetName('Cypress - DatasetManager_RequiredParameters');
  DatasetManager.getDatasetCreationNextStep().click();
  DatasetManager.selectNewDatasetSourceType(datasourceName);
};

describe('Dataset Manager - Required Parameters', () => {
  before(() => {
    stub.start();
    stub.setSolutions([SOLUTION]);
    stub.setWorkspaces([WORKSPACE_WITH_DATASET_MANAGER]);
    stub.setDatasets([DEFAULT_RUNNER_BASE_DATASET, DEFAULT_RUNNER_PARAMETER_DATASET]);
    stub.setRunners([DEFAULT_ETL_RUNNER, DEFAULT_SIMULATION_RUNNER]);
  });

  beforeEach(() => Login.login());
  after(stub.stop);

  it('must make parameters optional when config is inconsistent', () => {
    DatasetManager.switchToDatasetManagerView();
    startETLDatasetCreation(REQUIRED_ENABLED_WITH_INCONSISTENT_CONFIG_RUN_TEMPLATE.id);
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');
  });

  it('must not block dataset creation for parameters not impacted by the "required" option', () => {
    DatasetManager.switchToDatasetManagerView();
    startETLDatasetCreation(NOT_IMPACTED_BY_REQUIRED_RUN_TEMPLATE.id);
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');
  });

  it('must prevent dataset creation until all required parameters are set', () => {
    DatasetManager.switchToDatasetManagerView();
    startETLDatasetCreation(SCENARIO_REQUIRED_TRUE_RUN_TEMPLATE.id);
    RTParams.getSingleSelectInput('scenarioRequiredTrue').should('have.text', '');
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');
    RTParams.setSingleSelect('scenarioRequiredTrue', DEFAULT_SIMULATION_RUNNER.id);
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');

    DatasetManager.selectNewDatasetSourceType(NUMBER_REQUIRED_TRUE_RUN_TEMPLATE.id);
    RTParams.checkNumberValue('numberRequiredTrue', '0');
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');
    RTParams.clearNumber('numberRequiredTrue');
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');
    RTParams.setNumber('numberRequiredTrue', '1');
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');

    DatasetManager.selectNewDatasetSourceType(INT_REQUIRED_TRUE_RUN_TEMPLATE.id);
    RTParams.checkNumberValue('intRequiredTrue', '0');
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');
    RTParams.clearNumber('intRequiredTrue');
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');
    RTParams.setNumber('intRequiredTrue', '1.5');
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');
    RTParams.setNumber('intRequiredTrue', '2');
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');

    DatasetManager.selectNewDatasetSourceType(STRING_REQUIRED_TRUE_RUN_TEMPLATE.id);
    RTParams.checkStringValue('stringRequiredTrue', '');
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');
    RTParams.setString('stringRequiredTrue', 'a');
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');

    DatasetManager.selectNewDatasetSourceType(STRING_REQUIRED_UNDEFINED_MIN_LENGTH_1_RUN_TEMPLATE.id);
    RTParams.checkStringValue('stringRequiredUndefinedMinLength1', '');
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');
    RTParams.setString('stringRequiredUndefinedMinLength1', 'a');
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');

    DatasetManager.selectNewDatasetSourceType(FILE_REQUIRED_TRUE_RUN_TEMPLATE.id);
    RTParams.getFileName('fileRequiredTrue').should('not.exist');
    RTParams.getFileDeleteButton('fileRequiredTrue').should('not.exist');
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');
    RTParams.uploadFile('fileRequiredTrue', NINE_CUSTOMERS_DATASET_ZIP_FILE_PATH);
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');
    RTParams.deleteFile('fileRequiredTrue');
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');
    RTParams.getErrorMessage('fileRequiredTrue').should('contain', 'required');

    DatasetManager.selectNewDatasetSourceType(TABLE_REQUIRED_TRUE_RUN_TEMPLATE.id);
    const getTable = () => RTParams.getTableContainer('tableRequiredTrue');
    TableParameters.getRowsContainer(getTable()).should('not.exist'); // Table is empty
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');
    TableParameters.addRow(getTable());
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');
    TableParameters.getRow(getTable(), 0).click();
    TableParameters.deleteRows(getTable());
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');
  });

  it('must consider parameters as required by default during dataset creation', () => {
    const getTable = () => RTParams.getTableContainer('tableRequiredUndefined');
    DatasetManager.switchToDatasetManagerView();
    startETLDatasetCreation(REQUIRED_BY_DEFAULT_RUN_TEMPLATE.id);
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');

    // Set a value to all fields
    RTParams.setSingleSelect('scenarioRequiredUndefined', DEFAULT_SIMULATION_RUNNER.id);
    RTParams.setNumber('numberRequiredUndefined', '1');
    RTParams.setNumber('intRequiredUndefined', '2');
    RTParams.setString('stringRequiredUndefined', 'a');
    RTParams.toggleInMultiSelect('listRequiredUndefined', 'A');
    RTParams.uploadFile('fileRequiredUndefined', NINE_CUSTOMERS_DATASET_ZIP_FILE_PATH);
    TableParameters.addRow(getTable());
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');

    // Reset each field & check that Confirm button is disabled
    ScenarioParameters.clearDateParameterInput(RTParams.getDateInput('dateRequiredUndefined'));
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');
    ScenarioParameters.typeInDateParameterInput(RTParams.getDateInput('dateRequiredUndefined'), '01/01/2100');
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');

    RTParams.getSingleSelectInput('scenarioRequiredUndefined').click().clear().blur();
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');
    RTParams.setSingleSelect('scenarioRequiredUndefined', DEFAULT_SIMULATION_RUNNER.id);
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');

    RTParams.clearNumber('numberRequiredUndefined');
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');
    RTParams.setNumber('numberRequiredUndefined', '2');
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');

    RTParams.clearNumber('intRequiredUndefined');
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');
    RTParams.setNumber('intRequiredUndefined', '1.5');
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');
    RTParams.setNumber('intRequiredUndefined', '2');
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');

    RTParams.clearString('stringRequiredUndefined');
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');
    RTParams.setString('stringRequiredUndefined', 'b');
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');

    RTParams.toggleInMultiSelect('listRequiredUndefined', 'A', true);
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');
    RTParams.toggleInMultiSelect('listRequiredUndefined', 'B', true);
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');

    RTParams.deleteFile('fileRequiredUndefined');
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');
    RTParams.uploadFile('fileRequiredUndefined', NINE_CUSTOMERS_DATASET_ZIP_FILE_PATH);
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');

    TableParameters.getRow(getTable(), 0).click();
    TableParameters.deleteRows(getTable());
    DatasetManager.getConfirmDatasetCreation().should('be.disabled');
    TableParameters.addRow(getTable());
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');
  });

  it('must ignore parameters explicitly declared as non-required', () => {
    const getTable = () => RTParams.getTableContainer('tableRequiredFalse');
    DatasetManager.switchToDatasetManagerView();
    startETLDatasetCreation(REQUIRED_DISABLED_IN_CONFIG_RUN_TEMPLATE.id);
    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');

    // Check that values are empty
    RTParams.checkSingleSelectValue('scenarioRequiredFalse', '');

    ScenarioParameters.clearDateParameterInput(RTParams.getDateInput('dateRequiredFalse'));
    RTParams.getDateInput('dateRequiredFalse').should('value', '');

    RTParams.checkStringValue('stringRequiredFalse', '');
    RTParams.checkStringValue('stringRequiredFalseMinLength1', '');

    RTParams.checkMultiSelectValue('listRequiredFalse_noEnumValues', '');
    RTParams.checkMultiSelectValue('listRequiredFalse', '');

    RTParams.clearNumber('numberRequiredFalse');
    RTParams.checkNumberValue('numberRequiredFalse', '');
    RTParams.clearNumber('intRequiredFalse');
    RTParams.checkNumberValue('intRequiredFalse', '');

    RTParams.getFileDeleteButton('fileRequiredFalse').should('not.exist');
    RTParams.getFileName('fileRequiredFalse').should('not.exist');
    TableParameters.getRowsContainer(getTable()).should('not.exist'); // Table is empty

    DatasetManager.getConfirmDatasetCreation().should('not.be.disabled');
  });
});
