// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import {
  Downloads,
  DatasetManager,
  Login,
  RunTemplateParameters as RTParams,
  ScenarioParameters,
  TableParameters,
} from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { apiUtils, fileUtils } from '../../commons/utils';
import {
  ETL_BOOL,
  ETL_DATE,
  ETL_ENUM_PLAIN,
  ETL_ENUM_RADIO,
  ETL_ENUM_SCENARIOS,
  ETL_LIST,
  ETL_NUMBER_PLAIN,
  ETL_NUMBER_SLIDER,
  ETL_INT,
  ETL_STRING,
  ETL_FILE,
  ETL_TABLE,
  ETL_ALL_TYPES_RUN_TEMPLATE,
  SOLUTION_WITH_ETL_ALL_TYPES,
} from '../../fixtures/stubbing/DatasetManager_ETLParameters';
import {
  WORKSPACE_WITH_DATASET_MANAGER,
  DEFAULT_RUNNER_BASE_DATASET,
  DEFAULT_RUNNER_PARAMETER_DATASET,
  DEFAULT_ETL_RUNNER,
  DEFAULT_SIMULATION_RUNNER,
} from '../../fixtures/stubbing/default';

const FILE_PATH = 'customers.csv';

describe('Dataset Manager - ETL Parameters', () => {
  const datasetId = 'd-etl-all-types-test';
  const etlRunOptions = { expectedPollsCount: 0, finalIngestionStatus: 'SUCCESS' };

  before(() => {
    stub.start();
    stub.setSolutions([SOLUTION_WITH_ETL_ALL_TYPES]);
    stub.setWorkspaces([WORKSPACE_WITH_DATASET_MANAGER]);
    stub.setDatasets([DEFAULT_RUNNER_BASE_DATASET, DEFAULT_RUNNER_PARAMETER_DATASET]);
    stub.setRunners([DEFAULT_ETL_RUNNER, DEFAULT_SIMULATION_RUNNER]);
  });

  const WORKSPACE_ID = WORKSPACE_WITH_DATASET_MANAGER.id;
  beforeEach(() => Login.login({ url: `/${WORKSPACE_ID}/datasetmanager`, workspaceId: WORKSPACE_ID }));
  after(stub.stop);

  it('should test ETL parameter values are correctly sent to and received from the API', () => {
    const defaultSliderValue = 0;
    const newSliderValue = 80;
    DatasetManager.switchToDatasetManagerView([], { interceptDatasetQueries: false });
    DatasetManager.startDatasetCreation();
    DatasetManager.setNewDatasetName('ETL All Types Test Dataset');
    DatasetManager.getDatasetCreationNextStep().click();
    DatasetManager.selectNewDatasetSourceType(ETL_ALL_TYPES_RUN_TEMPLATE.id);

    // 1a. check that default values (or empty strings when possible) are correctly sent to the API on dataset creation.
    // Dataset part parameters are left empty on purpose for this step
    ScenarioParameters.clearDateParameterInput(RTParams.getDateInput(ETL_DATE.id));
    RTParams.checkDateFieldIsEmpty(ETL_DATE.id);
    RTParams.clearNumber(ETL_NUMBER_PLAIN.id);
    RTParams.clearNumber(ETL_INT.id);

    const validateCreateRunnerQuery = (req) => {
      expect(req.body.parametersValues).to.deep.equal([
        { parameterId: ETL_BOOL.id, varType: 'bool', value: 'false' },
        { parameterId: ETL_DATE.id, varType: 'date', value: '' },
        { parameterId: ETL_ENUM_PLAIN.id, varType: 'enum', value: 'A' },
        { parameterId: ETL_ENUM_RADIO.id, varType: 'enum', value: 'A' },
        { parameterId: ETL_ENUM_SCENARIOS.id, varType: 'enum', value: '' },
        { parameterId: ETL_LIST.id, varType: 'list', value: '[]' },
        { parameterId: ETL_NUMBER_PLAIN.id, varType: 'number', value: '' },
        { parameterId: ETL_NUMBER_SLIDER.id, varType: 'number', value: defaultSliderValue.toString() },
        { parameterId: ETL_INT.id, varType: 'int', value: '' },
        { parameterId: ETL_STRING.id, varType: 'string', value: '' },
      ]);
    };

    DatasetManager.confirmDatasetCreation({
      id: datasetId,
      isETL: true,
      importJobOptions: etlRunOptions,
      runnerCreationOptions: { validateRequest: validateCreateRunnerQuery },
    });

    DatasetManager.getRefreshDatasetSpinner(datasetId, 20).should('not.exist');
    DatasetManager.getUpdateDatasetParametersButton().should('not.be.disabled');

    // 1b. after dataset creation, check that all the ETL parameter values are correctly displayed in the edition dialog
    DatasetManager.openUpdateDatasetParametersDialog();

    RTParams.checkBoolValue(ETL_BOOL.id, 'false');
    RTParams.checkDateFieldIsEmpty(ETL_DATE.id);
    RTParams.checkEnumValue(ETL_ENUM_PLAIN.id, 'Option A');
    RTParams.checkRadioButtonOptionIsSelected(ETL_ENUM_RADIO.id, 'A');
    RTParams.checkScenarioSelectValue(ETL_ENUM_SCENARIOS.id, '');

    RTParams.getMultiSelectInput(ETL_LIST.id).click();
    RTParams.checkMultiSelectOptionValue('A', false);
    RTParams.checkMultiSelectOptionValue('B', false);
    RTParams.getMultiSelectInput(ETL_LIST.id).blur();

    RTParams.checkNumberValue(ETL_NUMBER_PLAIN.id, '');
    RTParams.checkSliderValue(ETL_NUMBER_SLIDER.id, defaultSliderValue);
    RTParams.checkNumberValue(ETL_INT.id, '');
    RTParams.checkStringValue(ETL_STRING.id, '');

    // 2a. First update of ETL parameters: change the previous values, force non-empty values for all parameters
    RTParams.getBoolInput(ETL_BOOL.id).check();
    ScenarioParameters.clearAndTypeInDateParameterInput(RTParams.getDateInput(ETL_DATE.id), '01/01/2000');
    RTParams.setEnumValue(ETL_ENUM_PLAIN.id, 'B');
    RTParams.setRadioButtonOption(ETL_ENUM_RADIO.id, 'B');
    RTParams.setScenarioSelect(ETL_ENUM_SCENARIOS.id, DEFAULT_SIMULATION_RUNNER.id);
    RTParams.toggleInMultiSelect(ETL_LIST.id, ['A', 'B'], true);
    RTParams.setNumber(ETL_NUMBER_PLAIN.id, 1.2);
    RTParams.setSlider(ETL_NUMBER_SLIDER.id, { min: 0, max: 100, value: newSliderValue });
    RTParams.setNumber(ETL_INT.id, 1);
    RTParams.setString(ETL_STRING.id, 'a');
    RTParams.uploadFile(ETL_FILE.id, FILE_PATH);
    TableParameters.addRow(RTParams.getTableContainer(ETL_TABLE.id));

    const validateFirstRunnerUpdateQuery = (req) => {
      expect(req.body.parametersValues).to.deep.equal([
        { parameterId: ETL_BOOL.id, varType: 'bool', value: 'true' },
        { parameterId: ETL_DATE.id, varType: 'date', value: '2000-01-01T00:00:00.000Z' },
        { parameterId: ETL_ENUM_PLAIN.id, varType: 'enum', value: 'B' },
        { parameterId: ETL_ENUM_RADIO.id, varType: 'enum', value: 'B' },
        { parameterId: ETL_ENUM_SCENARIOS.id, varType: 'enum', value: DEFAULT_SIMULATION_RUNNER.id },
        { parameterId: ETL_LIST.id, varType: 'list', value: '["A","B"]' },
        { parameterId: ETL_NUMBER_PLAIN.id, varType: 'number', value: '1.2' },
        { parameterId: ETL_NUMBER_SLIDER.id, varType: 'number', value: newSliderValue.toString() },
        { parameterId: ETL_INT.id, varType: 'int', value: '1' },
        { parameterId: ETL_STRING.id, varType: 'string', value: 'a' },
      ]);
    };

    DatasetManager.updateDatasetParameters(datasetId, {
      importJobOptions: etlRunOptions,
      validateRequest: validateFirstRunnerUpdateQuery,
      datasetPartEvents: [
        {
          id: 'dp-file',
          validateRequest: (req) => {
            const fileContent = fileUtils.getFileContentDataFromRequest(req);
            expect(fileContent).to.contain('name,age,canDrinkAlcohol,favoriteDrink,birthday,height');
          },
        },
        {
          id: 'dp-table',
          validateRequest: (req) => {
            const fileContent = fileUtils.getFileContentDataFromRequest(req);
            expect(fileContent).to.equal('name\nvalue');
          },
        },
      ],
    });

    // Add a specific interception because the Table content will be downloaded from dataset part when opening the
    // dataset edition dialog
    apiUtils.interceptDownloadDatasetPart({
      datasetId: DEFAULT_RUNNER_PARAMETER_DATASET.id,
      datasetPartId: 'dp-table',
    });
    DatasetManager.openUpdateDatasetParametersDialog();

    // 2b. after the update of the ETL parameter values, check the new values in the edition dialog
    RTParams.checkBoolValue(ETL_BOOL.id, 'true');
    RTParams.checkDateValue(ETL_DATE.id, '01/01/2000');
    RTParams.checkEnumValue(ETL_ENUM_PLAIN.id, 'Option B');
    RTParams.checkRadioButtonOptionIsSelected(ETL_ENUM_RADIO.id, 'B');
    RTParams.checkScenarioSelectValue(ETL_ENUM_SCENARIOS.id, DEFAULT_SIMULATION_RUNNER.name);

    RTParams.getMultiSelectInput(ETL_LIST.id).click();
    RTParams.checkMultiSelectOptionValue('A', true);
    RTParams.checkMultiSelectOptionValue('B', true);
    RTParams.getMultiSelectInput(ETL_LIST.id).blur();

    RTParams.checkNumberValue(ETL_NUMBER_PLAIN.id, '1.2');
    RTParams.checkSliderValue(ETL_NUMBER_SLIDER.id, newSliderValue);
    RTParams.checkNumberValue(ETL_INT.id, '1');
    RTParams.checkStringValue(ETL_STRING.id, 'a');

    RTParams.downloadFile(ETL_FILE.id, { datasetId: DEFAULT_RUNNER_PARAMETER_DATASET.id, datasetPartId: 'dp-file' });
    TableParameters.exportCSV(RTParams.getTableContainer(ETL_TABLE.id));
    Downloads.checkByContent(`${ETL_TABLE.id}.csv`, 'name\nvalue');

    // 3a. second update, resetting the fields to default or empty values
    RTParams.getBoolInput(ETL_BOOL.id).uncheck();
    ScenarioParameters.clearDateParameterInput(RTParams.getDateInput(ETL_DATE.id));
    RTParams.setEnumValue(ETL_ENUM_PLAIN.id, 'A');
    RTParams.setRadioButtonOption(ETL_ENUM_RADIO.id, 'A');
    RTParams.clearScenarioSelect(ETL_ENUM_SCENARIOS.id);
    RTParams.toggleInMultiSelect(ETL_LIST.id, ['A', 'B'], true);
    RTParams.clearNumber(ETL_NUMBER_PLAIN.id);
    RTParams.setSlider(ETL_NUMBER_SLIDER.id, { min: 0, max: 100, value: defaultSliderValue });
    RTParams.clearNumber(ETL_INT.id);
    RTParams.clearString(ETL_STRING.id);
    RTParams.deleteFile(ETL_FILE.id);
    TableParameters.getRow(RTParams.getTableContainer(ETL_TABLE.id), 0).click();
    TableParameters.deleteRows(RTParams.getTableContainer(ETL_TABLE.id));

    const validateSecondRunnerUpdateQuery = (req) => {
      expect(req.body.parametersValues).to.deep.equal([
        { parameterId: ETL_BOOL.id, varType: 'bool', value: 'false' },
        { parameterId: ETL_DATE.id, varType: 'date', value: '' },
        { parameterId: ETL_ENUM_PLAIN.id, varType: 'enum', value: 'A' },
        { parameterId: ETL_ENUM_RADIO.id, varType: 'enum', value: 'A' },
        { parameterId: ETL_ENUM_SCENARIOS.id, varType: 'enum', value: '' },
        { parameterId: ETL_LIST.id, varType: 'list', value: '[]' },
        { parameterId: ETL_NUMBER_PLAIN.id, varType: 'number', value: '' },
        { parameterId: ETL_NUMBER_SLIDER.id, varType: 'number', value: defaultSliderValue.toString() },
        { parameterId: ETL_INT.id, varType: 'int', value: '' },
        { parameterId: ETL_STRING.id, varType: 'string', value: '' },
      ]);
    };

    DatasetManager.updateDatasetParameters(datasetId, {
      importJobOptions: etlRunOptions,
      validateRequest: validateSecondRunnerUpdateQuery,
      datasetPartEvents: [
        { id: 'dp-file', delete: true },
        { id: 'dp-table', delete: true },
      ],
    });

    // 3b. after the 2nd update, check all ETL parameter values one last time
    DatasetManager.openUpdateDatasetParametersDialog();

    RTParams.checkBoolValue(ETL_BOOL.id, 'false');
    RTParams.checkDateFieldIsEmpty(ETL_DATE.id);
    RTParams.checkEnumValue(ETL_ENUM_PLAIN.id, 'Option A');
    RTParams.checkRadioButtonOptionIsSelected(ETL_ENUM_RADIO.id, 'A');
    RTParams.checkScenarioSelectValue(ETL_ENUM_SCENARIOS.id, '');

    RTParams.getMultiSelectInput(ETL_LIST.id).click();
    RTParams.checkMultiSelectOptionValue('A', false);
    RTParams.checkMultiSelectOptionValue('B', false);
    RTParams.getMultiSelectInput(ETL_LIST.id).blur();

    RTParams.checkNumberValue(ETL_NUMBER_PLAIN.id, '');
    RTParams.checkSliderValue(ETL_NUMBER_SLIDER.id, defaultSliderValue);
    RTParams.checkNumberValue(ETL_INT.id, '');
    RTParams.checkStringValue(ETL_STRING.id, '');

    RTParams.getFileDeleteButton(ETL_FILE.id).should('not.exist');
    RTParams.getFileName(ETL_FILE.id).should('not.exist');
    TableParameters.getRowsContainer(RTParams.getTableContainer(ETL_TABLE.id)).should('not.exist');
  });
});
