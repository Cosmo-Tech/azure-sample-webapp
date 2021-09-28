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
  STOCK_PARAM,
  INITIAL_STOCK_PARAM
} from '../../config/ScenarioParameters';
import { EditModeButton, NormalModeButton, ScenarioParametersTabs } from './components';
import { useTranslation } from 'react-i18next';
import { SimpleTwoActionsDialog, UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { BasicTypes, BarParameters } from './components/tabs';
import { UploadFileUtils } from './UploadFileUtils';
import { ScenarioParametersUtils } from './ScenarioParametersUtils';
import DatasetService from '../../services/dataset/DatasetService';
import { ORGANIZATION_ID } from '../../config/AppInstance';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    background: theme.palette.background.secondary,
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

const fetchDatasetById = async (datasetId) => {
  const { error, data } = await DatasetService.findDatasetById(ORGANIZATION_ID, datasetId);
  if (error) {
    throw new Error('Dataset does not exist for this organization');
  }
  return data;
};

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
    ScenarioParametersUtils.getValueFromParameters(defaultScenarioParameters.current, STOCK_PARAM)
  );

  const [restockQuantity, setRestockQuantity] = useState(
    ScenarioParametersUtils.getValueFromParameters(defaultScenarioParameters.current, RESTOCK_PARAM)
  );
  const [waitersNumber, setWaitersNumber] = useState(
    ScenarioParametersUtils.getValueFromParameters(defaultScenarioParameters.current, NBWAITERS_PARAM)
  );

  // State for basic input types examples Parameters
  const [currency, setCurrency] = useState(
    ScenarioParametersUtils.getValueFromParameters(defaultScenarioParameters.current, CURRENCY_PARAM)
  );
  const [currencyName, setCurrencyName] = useState(
    ScenarioParametersUtils.getValueFromParameters(defaultScenarioParameters.current, CURRENCY_NAME_PARAM)
  );
  const [currencyValue, setCurrencyValue] = useState(
    ScenarioParametersUtils.getValueFromParameters(defaultScenarioParameters.current, CURRENCY_VALUE_PARAM)
  );
  const [currencyUsed, setCurrencyUsed] = useState(
    ScenarioParametersUtils.getValueFromParameters(defaultScenarioParameters.current, CURRENCY_USED_PARAM)
  );
  const [startDate, setStartDate] = useState(
    ScenarioParametersUtils.getValueFromParameters(defaultScenarioParameters.current, START_DATE_PARAM)
  );

  // State for File Upload
  const [initialStockFile, setInitialStockFile] = useState({
    parameterId: INITIAL_STOCK_PARAM.id,
    description: INITIAL_STOCK_PARAM.description,
    initialName: '',
    name: '',
    file: null,
    status: UPLOAD_FILE_STATUS_KEY.EMPTY
  });

  const [initialStockDataset, setInitialStockDataset] = useState({});
  const [initialStockDatasetId, setInitialStockDatasetId] = useState('');

  useEffect(() => {
    const scenarioParameters = currentScenario.data.parametersValues;
    defaultScenarioParameters.current = scenarioParameters;
    const initialStockParameter = currentScenario.data?.parametersValues?.find(
      el => el.parameterId === INITIAL_STOCK_PARAM.id);
    setInitialStockDatasetId(initialStockParameter?.value === undefined ? '' : initialStockParameter.value);
    // eslint-disable-next-line
  }, [currentScenario]);

  useEffect(() => {
    // Reset parameters
    resetParameters(false, defaultScenarioParameters.current);
    // eslint-disable-next-line
  }, [changeEditMode, currentScenario]);

  useEffect(() => {
    UploadFileUtils.updateDatasetState(initialStockDatasetId,
      initialStockFile,
      () => fetchDatasetById(initialStockDatasetId),
      initialStockDataset,
      setInitialStockDataset,
      setInitialStockFile);
    // eslint-disable-next-line
  }, [initialStockDatasetId]);

  const resetParameters = (resetFile, parameters) => {
    // Bar parameters
    setStock(ScenarioParametersUtils.getValueFromParameters(parameters, STOCK_PARAM));
    setRestockQuantity(ScenarioParametersUtils.getValueFromParameters(parameters, RESTOCK_PARAM));
    setWaitersNumber(ScenarioParametersUtils.getValueFromParameters(parameters, NBWAITERS_PARAM));

    // Basic Types Sample
    setCurrency(ScenarioParametersUtils.getValueFromParameters(parameters, CURRENCY_PARAM));
    setCurrencyName(ScenarioParametersUtils.getValueFromParameters(parameters, CURRENCY_NAME_PARAM));
    setCurrencyValue(ScenarioParametersUtils.getValueFromParameters(parameters, CURRENCY_VALUE_PARAM));
    setCurrencyUsed(ScenarioParametersUtils.getValueFromParameters(parameters, CURRENCY_USED_PARAM));
    setStartDate(ScenarioParametersUtils.getValueFromParameters(parameters, START_DATE_PARAM));

    // Upload file
    if (resetFile) {
      UploadFileUtils.resetUploadFile(initialStockDatasetId, initialStockFile, setInitialStockFile);
    }
  };

  // TODO Change it in by a function using parameters values
  // eslint-disable-next-line
  const getParametersDataForApi = (newDataset, runTemplateId) => {
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
    if (['1', '2', '3', '4'].indexOf(runTemplateId) !== -1) {
      if (newDataset && Object.keys(newDataset).length !== 0) {
        parametersData = parametersData.concat([
          {
            parameterId: INITIAL_STOCK_PARAM.id,
            varType: INITIAL_STOCK_PARAM.varType,
            value: newDataset.id
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
    const newDataset = await UploadFileUtils.updateDatasetPartFile(initialStockDataset,
      setInitialStockDataset,
      initialStockFile,
      setInitialStockFile,
      initialStockDatasetId,
      setInitialStockDatasetId,
      INITIAL_STOCK_PARAM.id,
      INITIAL_STOCK_PARAM.connectorId,
      currentScenario.data.id,
      workspaceId);

    const parametersData = getParametersDataForApi(newDataset, currentScenario.data.runTemplateId);
    defaultScenarioParameters.current = parametersData;
    updateAndLaunchScenario(workspaceId, scenarioId, parametersData);
    changeEditMode(false);
  };
  const fileUploadComponent = UploadFileUtils.constructFileUpload(
    '0',
    initialStockFile,
    setInitialStockFile,
    initialStockDataset.id,
    INITIAL_STOCK_PARAM.defaultFileTypeFilter,
    editMode
  );
  // Indices in this array must match indices in the tabs configuration file src/config/ScenarioParameters.js
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

  return (
      <div>
        <Grid container direction="column" justifyContent="center" alignContent="flex-start" >
          <Grid
            container
            className={classes.root}
            direction="row"
            justifyContent="space-between"
            alignContent="flex-start"
            spacing={5}
          >
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
            id={'discard-changes'}
            open={displayPopup}
            labels={
              {
                title: t('genericcomponent.dialog.scenario.parameters.title'),
                body: t('genericcomponent.dialog.scenario.parameters.body'),
                button1: t('genericcomponent.dialog.scenario.parameters.button.cancel'),
                button2: t('genericcomponent.dialog.scenario.parameters.button.validate'),
                ariaLabelledby: 'discard-changes-dialog'
              }
            }
            handleClickOnButton1={handleClickOnPopupCancelButton}
            handleClickOnButton2={handleClickOnPopupDiscardChangeButton}
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
