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
import { SCENARIO_PARAMETERS_CONFIG } from '../../config/ScenarioParameters';
import { DATASET_ID_VARTYPE } from '../../services/config/ApiConstants';
import { EditModeButton, NormalModeButton, ScenarioParametersTabs } from './components';
import { useTranslation } from 'react-i18next';
import { SimpleTwoActionsDialog } from '@cosmotech/ui';
import { FileManagementUtils } from './FileManagementUtils';
import { ScenarioParametersUtils } from '../../utils';
import { ScenarioParametersTabFactory } from '../../utils/scenarioParameters/ScenarioParametersTabFactory';

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

const getRunTemplateParametersIds = (runTemplatesParametersIdsDict, runTemplateId) => {
  return runTemplatesParametersIdsDict?.[runTemplateId] || [];
};

const ScenarioParameters = ({
  editMode,
  changeEditMode,
  addDatasetToStore,
  updateAndLaunchScenario,
  launchScenario,
  workspaceId,
  currentScenario,
  solution,
  datasets,
  scenarioId
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [showDiscardConfirmationPopup, setShowDiscardConfirmationPopup] = useState(false);

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
  // Memoize the data of parameters (not including the current state of scenario parameters)
  const parametersMetadata = useMemo(
    () => ScenarioParametersUtils.generateParametersMetadata(
      solution, SCENARIO_PARAMETERS_CONFIG, runTemplateParametersIds),
    [solution, runTemplateParametersIds]);
  // Memoize the data of parameters groups (not including the current state of scenario parameters)
  const parametersGroupsMetadata = useMemo(
    () => ScenarioParametersUtils.generateParametersGroupsMetadata(
      solution, SCENARIO_PARAMETERS_CONFIG, currentScenario.data?.runTemplateId),
    [solution, currentScenario.data?.runTemplateId]);
  // Memoize the parameters values for reset
  const parametersValuesForReset = useMemo(
    () => ScenarioParametersUtils.getParametersValuesForReset(
      datasets,
      runTemplateParametersIds,
      defaultParametersValues,
      currentScenario.data?.parametersValues
    ),
    [datasets, runTemplateParametersIds, defaultParametersValues, currentScenario.data]);

  // Store the reset values for the run template parameters, based on defaultParametersValues and scenario data.
  const parametersValuesRef = useRef({});
  parametersValuesRef.current = parametersValuesForReset;

  const generateParametersValuesToRenderFromParametersValuesRef = () => {
    const newParametersValuesToRender = {};
    for (const parameterId in parametersValuesRef.current) {
      if (parametersMetadata[parameterId]?.varType === DATASET_ID_VARTYPE) {
        const datasetId = parametersValuesRef.current[parameterId];
        newParametersValuesToRender[parameterId] = FileManagementUtils.buildClientFileDescriptorFromDataset(
          datasets, datasetId);
      } else {
        newParametersValuesToRender[parameterId] = parametersValuesRef.current[parameterId];
      }
    }
    return newParametersValuesToRender;
  };

  const setParametersValuesToRenderFromParametersValuesRef = () => {
    setParametersValuesToRender(generateParametersValuesToRenderFromParametersValuesRef());
  };

  // Add scenario parameters data in state
  const [parametersValuesToRender, setParametersValuesToRender] = useState(
    generateParametersValuesToRenderFromParametersValuesRef());

  // Generate input components for each scenario parameters tab
  for (const parametersGroupMetadata of parametersGroupsMetadata) {
    parametersGroupMetadata.tab = ScenarioParametersTabFactory.create(
      t, datasets, parametersGroupMetadata, parametersValuesToRender, setParametersValuesToRender, editMode);
  }

  const discardLocalChanges = () => {
    setParametersValuesToRenderFromParametersValuesRef();
  };

  const setParametersValuesRefFromParametersValuesToRender = async () => {
    const newParametersValuesToPatch = {};
    for (const parameterId in parametersValuesToRender) {
      // Do not process "file" parameters, they will be handled in the function applyPendingOperationsOnFileParameters
      if (parametersMetadata[parameterId]?.varType !== DATASET_ID_VARTYPE) {
        newParametersValuesToPatch[parameterId] = parametersValuesToRender[parameterId];
      }
    }
    parametersValuesRef.current = {
      ...(parametersValuesRef.current),
      ...newParametersValuesToPatch
    };

    await FileManagementUtils.applyPendingOperationsOnFileParameters(
      solution,
      parametersMetadata,
      parametersValuesToRender,
      setParametersValuesToRender,
      parametersValuesRef,
      addDatasetToStore
    );
  };

  useEffect(() => {
    setParametersValuesToRenderFromParametersValuesRef();
    // eslint-disable-next-line
  }, [parametersValuesRef]);

  useEffect(() => {
    discardLocalChanges();
    // eslint-disable-next-line
  }, [currentScenario]);
  // }, [currentScenario.id]);

  const getParametersForUpdate = () => {
    const parametersData = ScenarioParametersUtils.buildParametersForUpdate(
      solution, parametersValuesRef.current, runTemplateParametersIds);
    return parametersData;
  };

  const startParametersEdition = () => changeEditMode(true);
  const askDiscardConfirmation = () => setShowDiscardConfirmationPopup(true);
  const cancelDiscard = () => setShowDiscardConfirmationPopup(false);
  const confirmDiscard = () => {
    setShowDiscardConfirmationPopup(false);
    changeEditMode(false);
    discardLocalChanges();
  };

  const startScenarioLaunch = async () => { await processScenarioLaunch(false); };
  const startScenarioUpdateAndLaunch = async () => { await processScenarioLaunch(true); };
  const processScenarioLaunch = async (forceUpdate) => {
    // If scenario parameters have never been updated, force parameters update
    if (!currentScenario.data.parametersValues || currentScenario.data.parametersValues.length === 0) {
      forceUpdate = true;
    }

    await setParametersValuesRefFromParametersValuesToRender();
    if (forceUpdate) {
      const parametersForUpdate = getParametersForUpdate();
      updateAndLaunchScenario(workspaceId, scenarioId, parametersForUpdate);
    } else {
      launchScenario(workspaceId, scenarioId);
    }
    changeEditMode(false);
  };

  const noTabsShown = parametersGroupsMetadata.length === 0;
  const isCurrentScenarioRunning = currentScenario.data.state === SCENARIO_RUN_STATE.RUNNING;

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
                  handleClickOnDiscardChange={askDiscardConfirmation}
                  handleClickOnUpdateAndLaunchScenario={startScenarioUpdateAndLaunch}/>)
                : (<NormalModeButton classes={classes}
                  handleClickOnEdit={startParametersEdition}
                  handleClickOnLaunchScenario={startScenarioLaunch}
                  editDisabled={noTabsShown || isCurrentScenarioRunning}
                  runDisabled={isCurrentScenarioRunning}/>)
              }
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.tabs}>
          {
            <form>
              <ScenarioParametersTabs
                parametersGroupsMetadata={parametersGroupsMetadata}
                currentScenario={currentScenario}
              />
            </form>
          }
        </Grid>
        <SimpleTwoActionsDialog
            id={'discard-changes'}
            open={showDiscardConfirmationPopup}
            labels={
              {
                title: t('genericcomponent.dialog.scenario.parameters.title'),
                body: t('genericcomponent.dialog.scenario.parameters.body'),
                button1: t('genericcomponent.dialog.scenario.parameters.button.cancel'),
                button2: t('genericcomponent.dialog.scenario.parameters.button.validate'),
                ariaLabelledby: 'discard-changes-dialog'
              }
            }
            handleClickOnButton1={cancelDiscard}
            handleClickOnButton2={confirmDiscard}
          />
      </div>
  );
};

ScenarioParameters.propTypes = {
  editMode: PropTypes.bool.isRequired,
  changeEditMode: PropTypes.func.isRequired,
  addDatasetToStore: PropTypes.func.isRequired,
  updateAndLaunchScenario: PropTypes.func.isRequired,
  launchScenario: PropTypes.func.isRequired,
  workspaceId: PropTypes.string.isRequired,
  scenarioId: PropTypes.string.isRequired,
  solution: PropTypes.object.isRequired,
  datasets: PropTypes.array.isRequired,
  currentScenario: PropTypes.object.isRequired
};

export default ScenarioParameters;
