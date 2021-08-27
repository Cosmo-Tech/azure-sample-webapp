// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import { SCENARIO_RUN_STATE } from '../../utils/ApiUtils';

import {
  SCENARIO_PARAMETERS_CONFIG,
  INITIAL_STOCK_PARAM
} from '../../config/ScenarioParameters';
import { EditModeButton, NormalModeButton, ScenarioParametersTabs } from './components';
import { useTranslation } from 'react-i18next';
import { SimpleTwoActionsDialog, UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { UploadFileUtils } from './UploadFileUtils';
import { ScenarioParametersUtils } from '../../utils';
import { ScenarioParametersTabFactory } from '../../utils/scenarioParameters/ScenarioParametersTabFactory';
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

const getRunTemplateParametersIds = (runTemplatesParametersIdsDict, runTemplateId) => {
  return runTemplatesParametersIdsDict?.[runTemplateId] || [];
};

const ScenarioParameters = ({
  editMode,
  changeEditMode,
  updateAndLaunchScenario,
  launchScenario,
  workspaceId,
  currentScenario,
  solution,
  scenarioId
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  // General states
  const [displayPopup, setDisplayPopup] = useState(false);

  // Memoize the parameters ids for the current run template
  const runTemplateParametersIds = useMemo(
    () => getRunTemplateParametersIds(solution.runTemplatesParametersIdsDict, currentScenario.data?.runTemplateId),
    [solution.runTemplatesParametersIdsDict, currentScenario.data?.runTemplateId]);
  // Memoize default values for run template parameters, based on config and solution description
  const defaultParametersValues = useMemo(
    () => ScenarioParametersUtils.getDefaultParametersValues(
      runTemplateParametersIds,
      solution.parameters,
      SCENARIO_PARAMETERS_CONFIG.parameters
    ), [runTemplateParametersIds, solution.parameters]);
  // Memoize the data of parameters groups (not including the current state of scenario parameters)
  const parametersGroupsData = useMemo(
    () => ScenarioParametersUtils.generateParametersGroupsData(
      solution, SCENARIO_PARAMETERS_CONFIG, currentScenario.data?.runTemplateId),
    [solution, currentScenario.data?.runTemplateId]);

  // Store the reset values for the run template parameters, based on defaultParametersValues and scenario data.
  const parametersValuesRef = useRef({});
  parametersValuesRef.current = ScenarioParametersUtils.getParametersValuesForReset(
    runTemplateParametersIds,
    defaultParametersValues,
    currentScenario.data?.parametersValues
  );

  // Add scenario parameters data in state
  const [parametersValuesToRender, setParametersValuesToRender] = useState(parametersValuesRef.current);

  useEffect(() => {
    resetParameters(false);
    // eslint-disable-next-line
  }, [currentScenario]);

  for (const parametersGroupData of parametersGroupsData) {
    parametersGroupData.tab = ScenarioParametersTabFactory.create(
      t, parametersGroupData, parametersValuesToRender, setParametersValuesToRender, editMode);
  }

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
    const initialStockParameter = currentScenario.data?.parametersValues?.find(
      el => el.parameterId === INITIAL_STOCK_PARAM.id);
    setInitialStockDatasetId(initialStockParameter?.value === undefined ? '' : initialStockParameter.value);
    // eslint-disable-next-line
  }, [currentScenario]);

  useEffect(() => {
    UploadFileUtils.updateDatasetState(initialStockDatasetId,
      initialStockFile,
      () => fetchDatasetById(initialStockDatasetId),
      initialStockDataset,
      setInitialStockDataset,
      setInitialStockFile);
    // eslint-disable-next-line
  }, [initialStockDatasetId]);

  const resetParameters = (resetFile) => {
    setParametersValuesToRender(parametersValuesRef.current);
    // TODO: adapt values for "file" parameters
    // Upload file
    if (resetFile) {
      UploadFileUtils.resetUploadFile(initialStockDatasetId, initialStockFile, setInitialStockFile);
    }
  };

  const setParametersValuesRefFromState = () => {
    parametersValuesRef.current = parametersValuesToRender;
    // TODO: adapt values for "file" parameters
  };

  const getParametersForUpdate = (newDataset) => {
    let parametersData = ScenarioParametersUtils.buildParametersForUpdate(
      solution, parametersValuesRef.current, runTemplateParametersIds);

    if (['1', '2', '3', '4'].indexOf(currentScenario.data.runTemplateId) !== -1) {
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
    resetParameters(true);
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
      setParametersValuesRefFromState();
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
    setParametersValuesRefFromState();
    const parametersForUpdate = getParametersForUpdate(newDataset);
    updateAndLaunchScenario(workspaceId, scenarioId, parametersForUpdate);
    changeEditMode(false);
  };
// eslint-disable-next-line
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
=======
    editMode);
>>>>>>> feat: add tabs generation & automatic build of params data for update

  // Disable edit button if no tabs are shown
  const tabsShown = parametersGroupsData.length > 0;

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
                parametersGroupsData={parametersGroupsData}
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
  solution: PropTypes.object.isRequired,
  currentScenario: PropTypes.object.isRequired
};

export default ScenarioParameters;
