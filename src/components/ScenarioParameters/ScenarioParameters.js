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

  useEffect(() => {
    defaultScenarioParameters.current = currentScenario.data.parametersValues;
    const initialStockParameter = currentScenario.data?.parametersValues?.find(el => el.parameterId === INITIAL_STOCK_PARAM_ID);
    setInitialStockDatasetId(initialStockParameter?.value);
  }, [currentScenario]);

  // State for bar defaultScenarioParameters
  const [stock, setStock] = useState(
    UploadFileUtils.getValueFromParameters(
      defaultScenarioParameters, STOCK_PARAM.id, STOCK_PARAM.defaultValue)
  );

  const [restockQuantity, setRestockQuantity] = useState(
    UploadFileUtils.getValueFromParameters(
      defaultScenarioParameters, RESTOCK_PARAM.id, RESTOCK_PARAM.defaultValue)
  );
  const [waitersNumber, setWaitersNumber] = useState(
    UploadFileUtils.getValueFromParameters(
      defaultScenarioParameters, NBWAITERS_PARAM.id, NBWAITERS_PARAM.defaultValue)
  );

  // State for basic input types examples defaultScenarioParameters
  const [currency, setCurrency] = useState(
    UploadFileUtils.getValueFromParameters(
      defaultScenarioParameters, CURRENCY_PARAM.id, CURRENCY_PARAM.defaultValue)
  );
  const [currencyName, setCurrencyName] = useState(
    UploadFileUtils.getValueFromParameters(
      defaultScenarioParameters, CURRENCY_NAME_PARAM.id, CURRENCY_NAME_PARAM.defaultValue)
  );
  const [currencyValue, setCurrencyValue] = useState(
    UploadFileUtils.getValueFromParameters(
      defaultScenarioParameters, CURRENCY_VALUE_PARAM.id, CURRENCY_VALUE_PARAM.defaultValue)
  );
  const [currencyUsed, setCurrencyUsed] = useState(
    UploadFileUtils.getValueFromParameters(
      defaultScenarioParameters, CURRENCY_USED_PARAM.id, CURRENCY_USED_PARAM.defaultValue)
  );
  const [startDate, setStartDate] = useState(
    UploadFileUtils.getValueFromParameters(
      defaultScenarioParameters, START_DATE_PARAM.id, new Date(START_DATE_PARAM.defaultValue))
  );

  const resetParameters = () => {
    setStock(UploadFileUtils.getValueFromParameters(defaultScenarioParameters, 'stock', 100));
    setRestockQuantity(UploadFileUtils.getValueFromParameters(defaultScenarioParameters, 'restock_qty', 25));
    setWaitersNumber(UploadFileUtils.getValueFromParameters(defaultScenarioParameters, 'nb_waiters', 5));
    setCurrency(UploadFileUtils.getValueFromParameters(defaultScenarioParameters, 'currency', 'USD'));
    setCurrencyName(UploadFileUtils.getValueFromParameters(defaultScenarioParameters, 'currency_name', 'EUR'));
    setCurrencyValue(UploadFileUtils.getValueFromParameters(defaultScenarioParameters, 'currency_value', 1000));
    setCurrencyUsed(UploadFileUtils.getValueFromParameters(defaultScenarioParameters, 'currency_used', false));
    setStartDate(UploadFileUtils.getValueFromParameters(defaultScenarioParameters, 'start_date', new Date('2014-08-18T21:11:54')));
  };

  // TODO Change it in by a function using parameters values
  // eslint-disable-next-line
  const getParametersDataForApi = (runTemplateId) => {
    let parametersData = [];
    // Add bar scenarioParameters if necessary (run templates '1' and '2')
    if (['1', '2'].indexOf(runTemplateId) !== -1) {
      parametersData = parametersData.concat([
        {
          parameterId: 'stock',
          varType: 'int',
          value: stock,
          isInherited: stock !== UploadFileUtils.getValueFromParameters(defaultScenarioParameters, 'stock')
        },
        {
          parameterId: 'restock_qty',
          varType: 'int',
          value: restockQuantity,
          isInherited: restockQuantity !== UploadFileUtils.getValueFromParameters(defaultScenarioParameters, 'restock_qty')
        },
        {
          parameterId: 'nb_waiters',
          varType: 'int',
          value: waitersNumber,
          isInherited: waitersNumber !== UploadFileUtils.getValueFromParameters(defaultScenarioParameters, 'nb_waiters')
        }
      ]);
    }

    // Add basic inputs examples defaultScenarioParameters if necessary (run template '4')
    if (['3'].indexOf(runTemplateId) !== -1) {
      parametersData = parametersData.concat([
        {
          parameterId: 'currency',
          varType: 'enum',
          value: currency,
          isInherited: currency !== UploadFileUtils.getValueFromParameters(defaultScenarioParameters, 'currency')
        },
        {
          parameterId: 'currency_name',
          varType: 'string',
          value: currencyName,
          isInherited: currencyName !== UploadFileUtils.getValueFromParameters(defaultScenarioParameters, 'currency_name')
        },
        {
          parameterId: 'currency_value',
          varType: 'number',
          value: currencyValue,
          isInherited: currencyValue !== UploadFileUtils.getValueFromParameters(defaultScenarioParameters, 'currency_value')
        },
        {
          parameterId: 'currency_used',
          varType: 'bool',
          value: currencyUsed,
          isInherited: currencyUsed !== UploadFileUtils.getValueFromParameters(defaultScenarioParameters, 'currency_used')
        },
        {
          parameterId: 'start_date',
          varType: 'date',
          value: startDate,
          isInherited: startDate !== UploadFileUtils.getValueFromParameters(defaultScenarioParameters, 'start_date')
        }
      ]);
    }
    // TODO Add initial stock parameters correctly!!!!
    if (['1', '2', '3', '4'].indexOf(runTemplateId) !== -1) {
      console.log('Before');
      console.log(initialStockDataset.current);
      if (initialStockDataset.current && Object.keys(initialStockDataset.current).length !== 0) {
        console.log('during');
        console.log(initialStockDataset.current);
        parametersData = parametersData.concat([
          {
            parameterId: INITIAL_STOCK_PARAM_ID,
            varType: '%DATASETID%',
            value: initialStockDataset.current.id
          }
        ]);
      }
    }
    console.log('After');
    console.log(parametersData);
    // TODO Add array template defaultScenarioParameters if necessary
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
    const destinationFilePath = UploadFileUtils.constructDestinationFile(currentScenario.data.id, INITIAL_STOCK_PARAM_ID, initialStockFile.name);
    await UploadFileUtils.fileManagement(initialStockDataset,
      initialStockFile,
      setInitialStockFile,
      initialStockDatasetId,
      AZURE_STORAGE_CONNECTOR_ID,
      currentScenario.data.id,
      workspaceId,
      destinationFilePath);

    const parametersData = getParametersDataForApi(currentScenario.data.runTemplateId);
    defaultScenarioParameters.current = parametersData;
    updateAndLaunchScenario(workspaceId, scenarioId, parametersData);
    changeEditMode(false);
  };

  const fileUploadComponent = UploadFileUtils.constructFileUpload('0',
    initialStockFile,
    setInitialStockFile,
    currentScenario.data.id,
    initialStockDataset, initialStockDatasetId,
    workspaceId, acceptedFileTypesToUpload,
    editMode);

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
