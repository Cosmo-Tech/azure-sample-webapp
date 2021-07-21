// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  CURRENCY_NAME_PARAM,
  CURRENCY_PARAM, CURRENCY_USED_PARAM, CURRENCY_VALUE_PARAM,
  NBWAITERS_PARAM,
  RESTOCK_PARAM,
  SCENARIO_PARAMETERS_TABS_CONFIG, START_DATE_PARAM,
  STOCK_PARAM
} from '../../configs/ScenarioParametersTabs.config';
import { useTranslation } from 'react-i18next';
import {
  SimpleTwoActionsDialog,
  EditModeButton,
  NormalModeButton,
  ScenarioParametersTabs,
  FileUpload
} from '@cosmotech/ui';
import { BasicTypes, BarParameters } from './components/tabs';
import {
  INITIAL_STOCK_PARAM_ACCEPT_FILE_TYPE,
  INITIAL_STOCK_PARAM_CONNECTOR_ID,
  INITIAL_STOCK_PARAM_ID
} from './UploadFileConfig';
import {
  DATASET_PARAM_VARTYPE,
  SCENARIO_RUN_STATE,
  UPLOAD_FILE_STATUS_KEY,
  ScenarioUtils,
  UploadFileUtils, ApiUtils
} from '@cosmotech/core';
import { ORGANIZATION_ID, WORKSPACE_ID } from '../../configs/App.config';
import { CosmotechApiService } from '../../configs/Api.config';
import WorkspaceService from '../../services/workspace/WorkspaceService';
import DatasetService from '../../services/dataset/DatasetService';
import { getAccessToken } from '../../utils/StorageUtils';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    background: theme.palette.background.secondary,
    color: '#FFFFFF',
    marginLeft: '30px',
    height: '50px',
    paddingTop: '10px'
  },
  rightBar: {
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    margin: `0 ${theme.spacing(3)}px`
  }
}));

const workspaceService = new WorkspaceService(CosmotechApiService);

const ScenarioParameters = ({
  editMode,
  changeEditMode,
  updateAndLaunchScenario,
  launchScenario,
  workspaceId,
  currentScenario,
  scenarioId
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  // General states
  const [displayPopup, setDisplayPopup] = useState(false);
  const defaultScenarioParameters = useRef([]);

  // State for bar Parameters
  const [stock, setStock] = useState(
    ScenarioUtils.getValueFromParameters(defaultScenarioParameters.current, STOCK_PARAM)
  );

  const [restockQuantity, setRestockQuantity] = useState(
    ScenarioUtils.getValueFromParameters(defaultScenarioParameters.current, RESTOCK_PARAM)
  );
  const [waitersNumber, setWaitersNumber] = useState(
    ScenarioUtils.getValueFromParameters(defaultScenarioParameters.current, NBWAITERS_PARAM)
  );

  // State for basic input types examples Parameters
  const [currency, setCurrency] = useState(
    ScenarioUtils.getValueFromParameters(defaultScenarioParameters.current, CURRENCY_PARAM)
  );
  const [currencyName, setCurrencyName] = useState(
    ScenarioUtils.getValueFromParameters(defaultScenarioParameters.current, CURRENCY_NAME_PARAM)
  );
  const [currencyValue, setCurrencyValue] = useState(
    ScenarioUtils.getValueFromParameters(defaultScenarioParameters.current, CURRENCY_VALUE_PARAM)
  );
  const [currencyUsed, setCurrencyUsed] = useState(
    ScenarioUtils.getValueFromParameters(defaultScenarioParameters.current, CURRENCY_USED_PARAM)
  );
  const [startDate, setStartDate] = useState(
    ScenarioUtils.getValueFromParameters(defaultScenarioParameters.current, START_DATE_PARAM)
  );

  // State for File Upload
  const [initialStockFile, setInitialStockFile] = useState({
    parameterId: INITIAL_STOCK_PARAM_ID,
    description: 'Initial stock dataset part',
    initialName: '',
    name: '',
    file: null,
    status: UPLOAD_FILE_STATUS_KEY.EMPTY
  });
  const initialStockDataset = useRef({});
  const [initialStockDatasetId, setInitialStockDatasetId] = useState('');

  useEffect(() => {
    const scenarioParameters = currentScenario.data.parametersValues;
    defaultScenarioParameters.current = scenarioParameters;
    resetParameters(false, scenarioParameters);
    const initialStockParameter = currentScenario.data?.parametersValues?.find(el => el.parameterId === INITIAL_STOCK_PARAM_ID);
    setInitialStockDatasetId(initialStockParameter?.value === undefined ? '' : initialStockParameter.value);
    // eslint-disable-next-line
  }, [currentScenario]);

  useEffect(() => {
    // Reset parameters
    resetParameters(false, defaultScenarioParameters.current);
    // eslint-disable-next-line
  }, [changeEditMode]);

  const resetParameters = (resetFile, parameters) => {
    // Bar parameters
    setStock(ScenarioUtils.getValueFromParameters(parameters, STOCK_PARAM));
    setRestockQuantity(ScenarioUtils.getValueFromParameters(parameters, RESTOCK_PARAM));
    setWaitersNumber(ScenarioUtils.getValueFromParameters(parameters, NBWAITERS_PARAM));

    // Basic Types Sample
    setCurrency(ScenarioUtils.getValueFromParameters(parameters, CURRENCY_PARAM));
    setCurrencyName(ScenarioUtils.getValueFromParameters(parameters, CURRENCY_NAME_PARAM));
    setCurrencyValue(ScenarioUtils.getValueFromParameters(parameters, CURRENCY_VALUE_PARAM));
    setCurrencyUsed(ScenarioUtils.getValueFromParameters(parameters, CURRENCY_USED_PARAM));
    setStartDate(ScenarioUtils.getValueFromParameters(parameters, START_DATE_PARAM));

    // Upload file
    if (resetFile) {
      UploadFileUtils.resetUploadFile(initialStockDatasetId, initialStockFile, setInitialStockFile);
    }
  };

  // TODO Change it in by a function using parameters values
  // eslint-disable-next-line
  const getParametersDataForApi = (runTemplateId) => {
    let parametersData = [];
    // Add bar scenarioParameters if necessary (run templates '1' and '2')
    if (['1', '2'].indexOf(runTemplateId) !== -1) {
      const stockParam = ScenarioUtils.constructParameterData(STOCK_PARAM, stock);
      const restockQuantityParam = ScenarioUtils.constructParameterData(RESTOCK_PARAM, restockQuantity);
      const waitersNumberParam = ScenarioUtils.constructParameterData(NBWAITERS_PARAM, waitersNumber);
      parametersData = parametersData.concat([
        stockParam,
        restockQuantityParam,
        waitersNumberParam
      ]);
    }

    // Add basic inputs examples parameters if necessary (run template '3')
    if (['3'].indexOf(runTemplateId) !== -1) {
      const currencyParam = ScenarioUtils.constructParameterData(CURRENCY_PARAM, currency);
      const currencyNameParam = ScenarioUtils.constructParameterData(CURRENCY_NAME_PARAM, currencyName);
      const currencyValueParam = ScenarioUtils.constructParameterData(CURRENCY_VALUE_PARAM, currencyValue);
      const currencyUsedParam = ScenarioUtils.constructParameterData(CURRENCY_USED_PARAM, currencyUsed);
      const startDateValueParam = ScenarioUtils.constructParameterData(START_DATE_PARAM, startDate);
      parametersData = parametersData.concat([
        currencyParam,
        currencyNameParam,
        currencyValueParam,
        currencyUsedParam,
        startDateValueParam
      ]);
    }
    if (['1', '2', '3', '4'].indexOf(runTemplateId) !== -1) {
      if (initialStockDataset.current && Object.keys(initialStockDataset.current).length !== 0) {
        parametersData = parametersData.concat([
          {
            parameterId: INITIAL_STOCK_PARAM_ID,
            varType: DATASET_PARAM_VARTYPE,
            value: initialStockDataset.current.id
          },
          {
            parameterId: 'initial_stock_fileName',
            varType: 'string',
            value: initialStockFile.name
          }
        ]);
      }
    }
    return parametersData;
  };

  // Popup part
  const handleClickOnDiscardChangeButton = () => setDisplayPopup(true);
  const handleClickOnPopupCancelButton = () => setDisplayPopup(false);
  const handleClickOnPopupDiscardChangeButton = () => {
    setDisplayPopup(false);
    changeEditMode(false);
    // Reset form values
    resetParameters(true, defaultScenarioParameters.current);
  };

  // Normal Mode Screen
  const handleClickOnEditButton = () => changeEditMode(true);
  const isCurrentScenarioRunning = () => (currentScenario.data.state === SCENARIO_RUN_STATE.RUNNING);

  const handleClickOnLaunchScenarioButton = () => {
    // If scenario parameters have never been updated, do it now
    if (!currentScenario.data.parametersValues ||
        currentScenario.data.parametersValues.length === 0) {
      handleClickOnUpdateAndLaunchScenarioButton();
    } else {
      launchScenario(workspaceId, scenarioId);
      changeEditMode(false);
    }
  };

  const handleClickOnUpdateAndLaunchScenarioButton = async () => {
    await workspaceService.updateDatasetPartFile(ORGANIZATION_ID,
      initialStockDataset,
      initialStockFile,
      setInitialStockFile,
      initialStockDatasetId,
      setInitialStockDatasetId,
      INITIAL_STOCK_PARAM_ID,
      INITIAL_STOCK_PARAM_CONNECTOR_ID,
      currentScenario.data.id,
      workspaceId);
    const parametersData = getParametersDataForApi(currentScenario.data.runTemplateId);
    defaultScenarioParameters.current = parametersData;
    updateAndLaunchScenario(workspaceId, scenarioId, parametersData);
    changeEditMode(false);
  };

  // Indices in this array must match indices in the tabs configuration file
  // configs/ScenarioParametersTabs.config.js
  const scenarioParametersTabs = [
    <FileUpload key={'0'}
      organisationId={ORGANIZATION_ID}
      file={initialStockFile}
      setFile={setInitialStockFile}
      currentDataset={initialStockDataset}
      datasetId={initialStockDatasetId}
      acceptedFileTypesToUpload={INITIAL_STOCK_PARAM_ACCEPT_FILE_TYPE}
      editMode={editMode}
      downloadFile={() => {
        workspaceService.downloadFile(
          ApiUtils.getDefaultBasePath(CosmotechApiService),
          getAccessToken(),
          ORGANIZATION_ID,
          WORKSPACE_ID,
          initialStockDataset,
          initialStockFile,
          setInitialStockFile);
      }}
      fetchDataset={() =>
        new DatasetService(CosmotechApiService)
          .findDatasetById(ORGANIZATION_ID, initialStockDatasetId)}
    />,
    <BarParameters key="1"
      stock={stock}
      changeStock={setStock}
      restockQuantity={restockQuantity}
      changeRestockQuantity={setRestockQuantity}
      waitersNumber={waitersNumber}
      changeWaitersNumber={setWaitersNumber}
      editMode={editMode}
    />,
    <BasicTypes key="2"
      textFieldValue={currencyName}
      changeTextField={setCurrencyName}
      numberFieldValue={currencyValue}
      changeNumberField={setCurrencyValue}
      enumFieldValue={currency}
      changeEnumField={setCurrency}
      switchFieldValue={currencyUsed}
      changeSwitchType={setCurrencyUsed}
      selectedDate={startDate}
      changeSelectedDate={setStartDate}
      editMode={editMode}
    />,
    <Typography key="3">Empty</Typography> // Array template
  ];

  // Disable edit button if no tabs are shown
  let tabsShown = false;
  for (const tab of SCENARIO_PARAMETERS_TABS_CONFIG) {
    if (tab.runTemplateIds.indexOf(currentScenario.data.runTemplateId) !== -1) {
      tabsShown = true;
      break;
    }
  }

  return (
      <div>
        <Grid container direction="column" justify="center" alignContent="flex-start" >
          <Grid container className={classes.root} direction="row" justify="space-between" alignContent="flex-start" spacing={5}>
            <Grid item >
              <Typography variant='subtitle1'>
                { t('genericcomponent.text.scenario.parameters.title', 'Scenario parameters') }

              </Typography>
            </Grid>
            <Grid item >
              { editMode
                ? (<EditModeButton classes={classes}
                  handleClickOnDiscardChange={handleClickOnDiscardChangeButton}
                  handleClickOnUpdateAndLaunchScenario={handleClickOnUpdateAndLaunchScenarioButton}/>)
                : (<NormalModeButton classes={classes}
                  handleClickOnEdit={handleClickOnEditButton}
                  handleClickOnLaunchScenario={handleClickOnLaunchScenarioButton}
                  editDisabled={!tabsShown || isCurrentScenarioRunning()}
                  runDisabled={isCurrentScenarioRunning()}/>)
              }
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.tabs}>
          {
            <form>
              <ScenarioParametersTabs
                tabs={scenarioParametersTabs}
                tabsConfig={SCENARIO_PARAMETERS_TABS_CONFIG}
                currentScenario={currentScenario}
              />
            </form>
          }
        </Grid>
        <SimpleTwoActionsDialog
            open={displayPopup}
            dialogTitleKey='genericcomponent.dialog.scenario.parameters.title'
            dialogBodyKey='genericcomponent.dialog.scenario.parameters.body'
            cancelLabelKey='genericcomponent.dialog.scenario.parameters.button.cancel'
            validateLabelKey='genericcomponent.dialog.scenario.parameters.button.validate'
            handleClickOnCancel={handleClickOnPopupCancelButton}
            handleClickOnValidate={handleClickOnPopupDiscardChangeButton}
          />
      </div>
  );
};

ScenarioParameters.propTypes = {
  editMode: PropTypes.bool.isRequired,
  changeEditMode: PropTypes.func.isRequired,
  updateAndLaunchScenario: PropTypes.func.isRequired,
  launchScenario: PropTypes.func.isRequired,
  workspaceId: PropTypes.string.isRequired,
  scenarioId: PropTypes.string.isRequired,
  currentScenario: PropTypes.object.isRequired
};

export default ScenarioParameters;
