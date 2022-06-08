// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, makeStyles, Typography, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { SCENARIO_PARAMETERS_CONFIG } from '../../config/ScenarioParameters';
import { DATASET_ID_VARTYPE, SCENARIO_RUN_STATE, SCENARIO_VALIDATION_STATUS } from '../../services/config/ApiConstants';
import { EditModeButton, NormalModeButton, ScenarioParametersTabs } from './components';
import { useTranslation } from 'react-i18next';
import { SimpleTwoActionsDialog, DontAskAgainDialog } from '@cosmotech/ui';
import { FileManagementUtils } from './FileManagementUtils';
import { ScenarioParametersUtils } from '../../utils';
import { ScenarioParametersTabFactory } from '../../utils/scenarioParameters/factories/ScenarioParametersTabFactory';
import { PERMISSIONS } from '../../services/config/Permissions';
import { PermissionsGate } from '../PermissionsGate';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    background: theme.palette.background.secondary,
    marginLeft: '30px',
    height: '50px',
    paddingTop: '10px',
  },
  rightBar: {
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    margin: `0 ${theme.spacing(3)}px`,
  },
  accordion: {
    backgroundColor: theme.palette.background.card,
  },
  accordionSummary: {
    flexDirection: 'row-reverse',
    marginLeft: '-10px',
  },
  accordionDetailsContent: {
    width: '100%',
  },
  gridContainerSummary: {
    direction: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridSummary: {
    marginLeft: '10px',
  },
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
  onChangeAccordionSummaryExpanded,
  accordionSummaryExpanded,
  workspaceId,
  scenarioList,
  currentScenario,
  solution,
  datasets,
  scenarioId,
  userRoles,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [showDiscardConfirmationPopup, setShowDiscardConfirmationPopup] = useState(false);

  // Memoize the parameters ids for the current run template
  const runTemplateParametersIds = useMemo(
    () => getRunTemplateParametersIds(solution.runTemplatesParametersIdsDict, currentScenario.data?.runTemplateId),
    [solution.runTemplatesParametersIdsDict, currentScenario.data?.runTemplateId]
  );
  // Memoize default values for run template parameters, based on config and solution description
  const defaultParametersValues = useMemo(
    () =>
      ScenarioParametersUtils.getDefaultParametersValues(
        runTemplateParametersIds,
        solution.parameters,
        SCENARIO_PARAMETERS_CONFIG.parameters
      ),
    [runTemplateParametersIds, solution.parameters]
  );
  // Memoize the data of parameters (not including the current state of scenario parameters)
  const parametersMetadata = useMemo(
    () =>
      ScenarioParametersUtils.generateParametersMetadata(
        solution,
        SCENARIO_PARAMETERS_CONFIG,
        runTemplateParametersIds
      ),
    [solution, runTemplateParametersIds]
  );
  // Memoize the data of parameters groups (not including the current state of scenario parameters)
  const parametersGroupsMetadata = useMemo(
    () =>
      ScenarioParametersUtils.generateParametersGroupsMetadata(
        solution,
        SCENARIO_PARAMETERS_CONFIG,
        currentScenario.data?.runTemplateId
      ),
    [solution, currentScenario.data?.runTemplateId]
  );
  // Memoize the parameters values for reset
  const parametersValuesForReset = useMemo(
    () =>
      ScenarioParametersUtils.getParametersValuesForReset(
        datasets,
        runTemplateParametersIds,
        defaultParametersValues,
        currentScenario.data?.parametersValues
      ),
    [datasets, runTemplateParametersIds, defaultParametersValues, currentScenario.data?.parametersValues]
  );

  // Store the reset values for the run template parameters, based on defaultParametersValues and scenario data.
  const parametersValuesRef = useRef(null);
  function getParametersValuesRef() {
    if (parametersValuesRef.current === null) {
      parametersValuesRef.current = parametersValuesForReset;
    }
    return parametersValuesRef.current;
  }

  const generateParametersValuesToRenderFromParametersValuesRef = () => {
    const newParametersValuesToRender = {};
    for (const parameterId in getParametersValuesRef()) {
      if (parametersMetadata[parameterId]?.varType === DATASET_ID_VARTYPE) {
        const datasetId = getParametersValuesRef()[parameterId];
        newParametersValuesToRender[parameterId] = FileManagementUtils.buildClientFileDescriptorFromDataset(
          datasets,
          datasetId
        );
      } else {
        newParametersValuesToRender[parameterId] = getParametersValuesRef()[parameterId];
      }
    }
    return newParametersValuesToRender;
  };

  // Add scenario parameters data in state
  const [parametersValuesToRender, setParametersValuesToRender] = useState(
    generateParametersValuesToRenderFromParametersValuesRef()
  );

  const setParametersValuesToRenderFromParametersValuesRef = () => {
    setParametersValuesToRender(generateParametersValuesToRenderFromParametersValuesRef());
  };

  // Generate input components for each scenario parameters tab
  for (const parametersGroupMetadata of parametersGroupsMetadata) {
    parametersGroupMetadata.tab = ScenarioParametersTabFactory.create(
      t,
      datasets,
      parametersGroupMetadata,
      parametersValuesToRender,
      setParametersValuesToRender,
      editMode
    );
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
      ...getParametersValuesRef(),
      ...newParametersValuesToPatch,
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
    parametersValuesRef.current = parametersValuesForReset;
    discardLocalChanges();
    // eslint-disable-next-line
  }, [currentScenario.data.id]);

  const getParametersForUpdate = () => {
    const parametersData = ScenarioParametersUtils.buildParametersForUpdate(
      solution,
      getParametersValuesRef(),
      runTemplateParametersIds
    );
    const additionalParameters = ScenarioParametersUtils.buildAdditionalParameters(currentScenario, scenarioList);
    return parametersData.concat(additionalParameters);
  };

  const startParametersEdition = (event) => {
    if (accordionSummaryExpanded) {
      event.stopPropagation();
    }
    changeEditMode(true);
  };

  const [showWarningBeforeLaunchPopup, setShowWarningBeforeLaunchPopup] = useState(false);
  const closeConfirmLaunchDialog = () => {
    setShowWarningBeforeLaunchPopup(false);
  };

  const updateBeforeLaunch = useRef(null);

  const confirmAndLaunch = (event, updateBeforeLaunch_) => {
    event.stopPropagation();
    updateBeforeLaunch.current = updateBeforeLaunch_;
    if (localStorage.getItem('dontAskAgainToConfirmLaunch') === 'true') {
      startScenarioLaunch();
    } else {
      setShowWarningBeforeLaunchPopup(true);
    }
  };

  const startScenarioLaunch = async () => {
    const forceUpdate = ScenarioParametersUtils.shouldForceUpdateScenarioParameters();
    await processScenarioLaunch(forceUpdate || updateBeforeLaunch.current);
  };

  const askDiscardConfirmation = (event) => {
    event.stopPropagation();
    setShowDiscardConfirmationPopup(true);
  };
  const cancelDiscard = () => {
    setShowDiscardConfirmationPopup(false);
  };
  const confirmDiscard = () => {
    setShowDiscardConfirmationPopup(false);
    changeEditMode(false);
    discardLocalChanges();
  };

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

  const preventSubmit = (event) => {
    event.preventDefault();
  };

  const noTabsShown = parametersGroupsMetadata.length === 0;
  const isCurrentScenarioRunning = currentScenario.data.state === SCENARIO_RUN_STATE.RUNNING;
  const isCurrentScenarioRejected = currentScenario.data.validationStatus === SCENARIO_VALIDATION_STATUS.REJECTED;
  const isCurrentScenarioValidated = currentScenario.data.validationStatus === SCENARIO_VALIDATION_STATUS.VALIDATED;
  const isEditDisabled =
    noTabsShown || isCurrentScenarioRunning || isCurrentScenarioRejected || isCurrentScenarioValidated;

  let disabledEditTooltip;
  if (isCurrentScenarioRunning) {
    disabledEditTooltip = t(
      'commoncomponents.button.scenario.parameters.disabledEditTooltip.running',
      'Parameters can not be edited while the scenario is running'
    );
  } else if (isCurrentScenarioRejected) {
    disabledEditTooltip = t(
      'commoncomponents.button.scenario.parameters.disabledEditTooltip.rejected',
      'This scenario is rejected, you can not edit its parameters'
    );
  } else if (isCurrentScenarioValidated) {
    disabledEditTooltip = t(
      'commoncomponents.button.scenario.parameters.disabledEditTooltip.validated',
      'This scenario is validated, you can not edit its parameters'
    );
  } else if (noTabsShown) {
    disabledEditTooltip = t(
      'commoncomponents.button.scenario.parameters.disabledEditTooltip.noTabs',
      'No parameters to edit'
    );
  }

  const handleSummaryClick = () => {
    const expandedNewState = !accordionSummaryExpanded;
    localStorage.setItem('scenarioParametersAccordionExpanded', expandedNewState);
    onChangeAccordionSummaryExpanded(expandedNewState);
  };

  return (
    <div>
      <Accordion className={classes.accordion} expanded={accordionSummaryExpanded}>
        <AccordionSummary
          data-cy="scenario-params-accordion-summary"
          className={classes.accordionSummary}
          expandIcon={<ExpandMoreIcon />}
          onClick={handleSummaryClick}
        >
          <Grid container className={classes.gridContainerSummary}>
            <Grid className={classes.gridSummary}>
              <Typography variant="subtitle1">
                {t('genericcomponent.text.scenario.parameters.title', 'Scenario parameters')}
              </Typography>
            </Grid>
            <Grid item>
              <PermissionsGate authorizedPermissions={[PERMISSIONS.canEditOrLaunchScenario]}>
                {editMode ? (
                  <EditModeButton
                    classes={classes}
                    handleClickOnDiscardChange={(event) => askDiscardConfirmation(event)}
                    handleClickOnUpdateAndLaunchScenario={(event) => confirmAndLaunch(event, true)}
                  />
                ) : (
                  <NormalModeButton
                    classes={classes}
                    handleClickOnEdit={(event) => startParametersEdition(event)}
                    handleClickOnLaunchScenario={(event) => confirmAndLaunch(event, false)}
                    editDisabled={isEditDisabled}
                    runDisabled={isCurrentScenarioRunning}
                    disabledEditTooltip={disabledEditTooltip}
                  />
                )}
              </PermissionsGate>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.accordionDetailsContent}>
            {
              <form onSubmit={preventSubmit}>
                <ScenarioParametersTabs parametersGroupsMetadata={parametersGroupsMetadata} userRoles={userRoles} />
              </form>
            }
          </div>
        </AccordionDetails>
      </Accordion>
      <SimpleTwoActionsDialog
        id={'discard-changes'}
        open={showDiscardConfirmationPopup}
        labels={{
          title: t('genericcomponent.dialog.scenario.parameters.title'),
          body: t('genericcomponent.dialog.scenario.parameters.body'),
          button1: t('genericcomponent.dialog.scenario.parameters.button.cancel'),
          button2: t('genericcomponent.dialog.scenario.parameters.button.validate'),
        }}
        handleClickOnButton1={cancelDiscard}
        handleClickOnButton2={confirmDiscard}
      />
      <DontAskAgainDialog
        id={'launch'}
        open={showWarningBeforeLaunchPopup}
        labels={{
          title: t('genericcomponent.dialog.scenario.parameters.confirmLaunchDialog.title'),
          body: t('genericcomponent.dialog.scenario.parameters.confirmLaunchDialog.body'),
          cancel: t('genericcomponent.dialog.scenario.parameters.button.cancel'),
          confirm: t('genericcomponent.dialog.scenario.parameters.button.launch'),
          checkbox: t('genericcomponent.dialog.scenario.parameters.confirmLaunchDialog.checkbox'),
        }}
        onClose={closeConfirmLaunchDialog}
        onConfirm={(dontAskAgain) => {
          localStorage.setItem('dontAskAgainToConfirmLaunch', dontAskAgain);
          startScenarioLaunch();
        }}
      />
    </div>
  );
};

ScenarioParameters.propTypes = {
  editMode: PropTypes.bool.isRequired,
  changeEditMode: PropTypes.func.isRequired,
  addDatasetToStore: PropTypes.func.isRequired,
  updateAndLaunchScenario: PropTypes.func.isRequired,
  onChangeAccordionSummaryExpanded: PropTypes.func.isRequired,
  launchScenario: PropTypes.func.isRequired,
  accordionSummaryExpanded: PropTypes.bool.isRequired,
  workspaceId: PropTypes.string.isRequired,
  scenarioId: PropTypes.string.isRequired,
  scenarioList: PropTypes.array.isRequired,
  solution: PropTypes.object.isRequired,
  datasets: PropTypes.array.isRequired,
  currentScenario: PropTypes.object.isRequired,
  userRoles: PropTypes.array.isRequired,
};

export default ScenarioParameters;
