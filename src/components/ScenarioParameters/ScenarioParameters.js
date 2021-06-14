// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import { SCENARIO_RUN_STATE } from '../../utils/ApiUtils';
import {
  CURRENCY_NAME_PARAM,
  CURRENCY_PARAM, CURRENCY_USED_PARAM, CURRENCY_VALUE_PARAM,
  NBWAITERS_PARAM,
  RESTOCK_PARAM,
  SCENARIO_PARAMETERS_TABS_CONFIG, START_DATE_PARAM,
  STOCK_PARAM
} from '../../configs/ScenarioParametersTabs.config';
import { EditModeButton, NormalModeButton, ScenarioParametersTabs } from './components';
import { useTranslation } from 'react-i18next';
import { SimpleTwoActionsDialog } from '@cosmotech/ui';
import { BasicTypes, BarParameters } from './components/tabs';
import { acceptedFileTypesToUpload } from '../../configs/App.config';
import { UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui/src/UploadFile/StatusConstants';
import { AZURE_STORAGE_CONNECTOR_ID, INITIAL_STOCK_PARAM_ID } from './UploadFileConfig';
import { UploadFileUtils } from './UploadFileUtils';
import { DATASET_PARAM_VARTYPE, ScenarioParametersUtils } from './ScenarioParametersUtils';

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

  /// //////////////////////////////////////////////////////////////////////// INITIAL STOCK
  // State for File Upload
  const [initialStockFile, setInitialStockFile] = useState({
    parameterId: INITIAL_STOCK_PARAM_ID,
    description: 'Initial stock dataset part',
    name: '',
    file: null,
    status: UPLOAD_FILE_STATUS_KEY.EMPTY
  });
  const initialStockDataset = useRef({});
  const [initialStockDatasetId, setInitialStockDatasetId] = useState('');
  /// //////////////////////////////////////////////////////////////////////// INITIAL STOCK

  useEffect(() => {
    defaultScenarioParameters.current = currentScenario.data.parametersValues;
    /// //////////////////////////////////////////////////////////////////////// INITIAL STOCK
    const initialStockParameter = currentScenario.data?.parametersValues?.find(el => el.parameterId === INITIAL_STOCK_PARAM_ID);
    setInitialStockDatasetId(initialStockParameter?.value);
    /// //////////////////////////////////////////////////////////////////////// INITIAL STOCK
    // eslint-disable-next-line
  }, [currentScenario, changeEditMode, initialStockFile.status]);

  // State for bar defaultScenarioParameters
  const [stock, setStock] = useState(
    UploadFileUtils.getValueFromParameters(defaultScenarioParameters, STOCK_PARAM)
  );

  const [restockQuantity, setRestockQuantity] = useState(
    UploadFileUtils.getValueFromParameters(defaultScenarioParameters, RESTOCK_PARAM)
  );
  const [waitersNumber, setWaitersNumber] = useState(
    UploadFileUtils.getValueFromParameters(defaultScenarioParameters, NBWAITERS_PARAM)
  );

  // State for basic input types examples defaultScenarioParameters
  const [currency, setCurrency] = useState(
    UploadFileUtils.getValueFromParameters(defaultScenarioParameters, CURRENCY_PARAM)
  );
  const [currencyName, setCurrencyName] = useState(
    UploadFileUtils.getValueFromParameters(defaultScenarioParameters, CURRENCY_NAME_PARAM)
  );
  const [currencyValue, setCurrencyValue] = useState(
    UploadFileUtils.getValueFromParameters(defaultScenarioParameters, CURRENCY_VALUE_PARAM)
  );
  const [currencyUsed, setCurrencyUsed] = useState(
    UploadFileUtils.getValueFromParameters(defaultScenarioParameters, CURRENCY_USED_PARAM)
  );
  const [startDate, setStartDate] = useState(
    UploadFileUtils.getValueFromParameters(defaultScenarioParameters, START_DATE_PARAM)
  );

  const resetParameters = () => {
    // Bar parameters
    setStock(UploadFileUtils.getValueFromParameters(defaultScenarioParameters, STOCK_PARAM));
    setRestockQuantity(UploadFileUtils.getValueFromParameters(defaultScenarioParameters, RESTOCK_PARAM));
    setWaitersNumber(UploadFileUtils.getValueFromParameters(defaultScenarioParameters, NBWAITERS_PARAM));

    // Basic Types Sample
    setCurrency(UploadFileUtils.getValueFromParameters(defaultScenarioParameters, CURRENCY_PARAM));
    setCurrencyName(UploadFileUtils.getValueFromParameters(defaultScenarioParameters, CURRENCY_NAME_PARAM));
    setCurrencyValue(UploadFileUtils.getValueFromParameters(defaultScenarioParameters, CURRENCY_VALUE_PARAM));
    setCurrencyUsed(UploadFileUtils.getValueFromParameters(defaultScenarioParameters, CURRENCY_USED_PARAM));
    setStartDate(UploadFileUtils.getValueFromParameters(defaultScenarioParameters, START_DATE_PARAM));
    /// //////////////////////////////////////////////////////////////////////// INITIAL STOCK
    UploadFileUtils.resetUploadFile(initialStockDatasetId, initialStockFile, setInitialStockFile);
    /// //////////////////////////////////////////////////////////////////////// INITIAL STOCK
  };

  // TODO Change it in by a function using parameters values
  // eslint-disable-next-line
  const getParametersDataForApi = (runTemplateId) => {
    let parametersData = [];
    // Add bar scenarioParameters if necessary (run templates '1' and '2')
    if (['1', '2'].indexOf(runTemplateId) !== -1) {
      const stockParam = ScenarioParametersUtils.constructParameterData(STOCK_PARAM, stock);
      const restockQuantityParam = ScenarioParametersUtils.constructParameterData(RESTOCK_PARAM, restockQuantity);
      const waitersNumberParam = ScenarioParametersUtils.constructParameterData(NBWAITERS_PARAM, waitersNumber);
      parametersData = parametersData.concat([
        stockParam,
        restockQuantityParam,
        waitersNumberParam
      ]);
    }

    // Add basic inputs examples parameters if necessary (run template '3')
    if (['3'].indexOf(runTemplateId) !== -1) {
      const currencyParam = ScenarioParametersUtils.constructParameterData(CURRENCY_PARAM, currency);
      const currencyNameParam = ScenarioParametersUtils.constructParameterData(CURRENCY_NAME_PARAM, currencyName);
      const currencyValueParam = ScenarioParametersUtils.constructParameterData(CURRENCY_VALUE_PARAM, currencyValue);
      const currencyUsedParam = ScenarioParametersUtils.constructParameterData(CURRENCY_USED_PARAM, currencyUsed);
      const startDateValueParam = ScenarioParametersUtils.constructParameterData(START_DATE_PARAM, startDate);
      parametersData = parametersData.concat([
        currencyParam,
        currencyNameParam,
        currencyValueParam,
        currencyUsedParam,
        startDateValueParam
      ]);
    }
    /// //////////////////////////////////////////////////////////////////////// INITIAL STOCK
    // TODO Add initial stock parameters correctly!!!!
    if (['1', '2', '3', '4'].indexOf(runTemplateId) !== -1) {
      if (initialStockDataset.current && Object.keys(initialStockDataset.current).length !== 0) {
        parametersData = parametersData.concat([
          {
            parameterId: INITIAL_STOCK_PARAM_ID,
            varType: DATASET_PARAM_VARTYPE,
            value: initialStockDataset.current.id
          }
        ]);
      }
    }
    /// //////////////////////////////////////////////////////////////////////// INITIAL STOCK
    return parametersData;
  };

  // Popup part
  const handleClickOnDiscardChangeButton = () => setDisplayPopup(true);
  const handleClickOnPopupCancelButton = () => setDisplayPopup(false);
  const handleClickOnPopupDiscardChangeButton = () => {
    setDisplayPopup(false);
    changeEditMode(false);
    // Reset form values
    resetParameters();
  };

  // Normal Mode Screen
  const handleClickOnEditButton = () => changeEditMode(true);
  const isCurrentScenarioRunning = () => (currentScenario.data.state === SCENARIO_RUN_STATE.RUNNING);

  const handleClickOnLaunchScenarioButton = () => {
    launchScenario(workspaceId, scenarioId);
    changeEditMode(false);
  };

  const handleClickOnUpdateAndLaunchScenarioButton = async () => {
    /// //////////////////////////////////////////////////////////////////////// INITIAL STOCK
    const destinationFilePath = UploadFileUtils.constructDestinationFile(currentScenario.data.id, INITIAL_STOCK_PARAM_ID, initialStockFile.name);
    await UploadFileUtils.fileManagement(initialStockDataset,
      initialStockFile,
      setInitialStockFile,
      initialStockDatasetId,
      AZURE_STORAGE_CONNECTOR_ID,
      currentScenario.data.id,
      workspaceId,
      destinationFilePath);
    /// //////////////////////////////////////////////////////////////////////// INITIAL STOCK
    const parametersData = getParametersDataForApi(currentScenario.data.runTemplateId);
    defaultScenarioParameters.current = parametersData;
    updateAndLaunchScenario(workspaceId, scenarioId, parametersData);
    changeEditMode(false);
  };
  /// //////////////////////////////////////////////////////////////////////// INITIAL STOCK
  const fileUploadComponent = UploadFileUtils.constructFileUpload('0',
    initialStockFile,
    setInitialStockFile,
    currentScenario.data.id,
    initialStockDataset,
    initialStockDatasetId,
    INITIAL_STOCK_PARAM_ID,
    workspaceId, acceptedFileTypesToUpload,
    editMode);
  /// //////////////////////////////////////////////////////////////////////// INITIAL STOCK
  // Indices in this array must match indices in the tabs configuration file
  // configs/ScenarioParametersTabs.config.js
  const scenarioParametersTabs = [
    fileUploadComponent,
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

  // TODO check if genericcomponent.text.scenario.defaultScenarioParameters.title exists
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
