// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SCENARIO_RUN_STATE, SCENARIO_VALIDATION_STATUS } from '../../services/config/ApiConstants';
import { ACL_PERMISSIONS } from '../../services/config/accessControl';
import { EditModeButton, NormalModeButton, ScenarioParametersTabsWrapper } from './components';
import { useTranslation } from 'react-i18next';
import { SimpleTwoActionsDialog, DontAskAgainDialog, PermissionsGate } from '@cosmotech/ui';
import { useScenarioParameters } from './ScenarioParametersHook';
import { ScenarioParametersUtils, FileManagementUtils } from '../../utils';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    marginLeft: '30px',
    height: '50px',
    paddingTop: '10px',
  },
  rightBar: {
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    margin: `0 ${theme.spacing(3)}`,
  },
  accordionSummary: {
    flexDirection: 'row-reverse',
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
  onChangeAccordionSummaryExpanded,
  accordionSummaryExpanded,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    scenariosData,
    datasetsData,
    addDatasetToStore,
    currentScenarioData,
    organizationId,
    workspaceId,
    solutionData,
    userRoles,
    launchScenario,
    updateAndLaunchScenario,
    userPermissionsOnCurrentScenario,
    isDarkTheme,
  } = useScenarioParameters();
  const scenarioId = currentScenarioData?.id;
  const [showDiscardConfirmationPopup, setShowDiscardConfirmationPopup] = useState(false);

  const { reset, getValues, setValue } = useFormContext();

  // Memoize the parameters ids for the current run template
  const runTemplateParametersIds = useMemo(
    () => getRunTemplateParametersIds(solutionData.runTemplatesParametersIdsDict, currentScenarioData?.runTemplateId),
    [solutionData.runTemplatesParametersIdsDict, currentScenarioData?.runTemplateId]
  );
  // Memoize default values for run template parameters, based on solutionData description
  const defaultParametersValues = useMemo(
    () => ScenarioParametersUtils.getDefaultParametersValues(runTemplateParametersIds, solutionData.parameters),
    [runTemplateParametersIds, solutionData.parameters]
  );
  // Memoize the data of parameters (not including the current state of scenario parameters)
  const parametersMetadata = useMemo(
    () => ScenarioParametersUtils.generateParametersMetadata(solutionData, runTemplateParametersIds),
    [solutionData, runTemplateParametersIds]
  );
  // Memoize the data of parameters groups (not including the current state of scenario parameters)
  const parametersGroupsMetadata = useMemo(
    () => ScenarioParametersUtils.generateParametersGroupsMetadata(solutionData, currentScenarioData?.runTemplateId),
    [solutionData, currentScenarioData?.runTemplateId]
  );
  // Memoize the parameters values for reset
  const parametersValuesForReset = useMemo(
    () =>
      ScenarioParametersUtils.getParametersValuesForReset(
        datasetsData,
        runTemplateParametersIds,
        defaultParametersValues,
        currentScenarioData?.parametersValues
      ),
    [datasetsData, runTemplateParametersIds, defaultParametersValues, currentScenarioData?.parametersValues]
  );

  const generateParametersValuesFromOriginalValues = () => {
    return ScenarioParametersUtils.buildParametersValuesFromOriginalValues(
      parametersValuesForReset,
      parametersMetadata,
      datasetsData,
      FileManagementUtils.buildClientFileDescriptorFromDataset
    );
  };

  const resetParametersValues = () => {
    const resetValues = generateParametersValuesFromOriginalValues();
    reset(resetValues);
  };

  const discardLocalChanges = () => {
    resetParametersValues();
  };

  const updateParameterValue = (parameterId, keyToPatch, newValue) => {
    const currentValue = getValues(parameterId);
    setValue(parameterId, {
      ...currentValue,
      [keyToPatch]: newValue,
    });
  };

  const processFilesParameters = async () => {
    const parametersValues = getValues();
    await FileManagementUtils.applyPendingOperationsOnFileParameters(
      organizationId,
      workspaceId,
      solutionData,
      parametersMetadata,
      parametersValues,
      updateParameterValue,
      addDatasetToStore
    );
  };

  // You can use the context object to pass all additional information to custom tab factory
  const context = {
    editMode,
    isDarkTheme,
  };

  useEffect(() => {
    discardLocalChanges();
    // eslint-disable-next-line
  }, [currentScenarioData?.id]);

  const getParametersForUpdate = () => {
    const parametersValues = getValues();
    return ScenarioParametersUtils.buildParametersForUpdate(
      solutionData,
      parametersValues,
      runTemplateParametersIds,
      currentScenarioData,
      scenariosData
    );
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
    const forceUpdate = ScenarioParametersUtils.shouldForceScenarioParametersUpdate(runTemplateParametersIds);
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
    if (!currentScenarioData?.parametersValues || currentScenarioData?.parametersValues.length === 0) {
      forceUpdate = true;
    }

    await processFilesParameters();
    if (forceUpdate) {
      const parametersForUpdate = getParametersForUpdate();
      updateAndLaunchScenario(scenarioId, parametersForUpdate);
    } else {
      launchScenario(scenarioId);
    }
    changeEditMode(false);
  };

  const preventSubmit = (event) => {
    event.preventDefault();
  };

  const noTabsShown = parametersGroupsMetadata.length === 0;
  const isCurrentScenarioRunning =
    currentScenarioData?.state === SCENARIO_RUN_STATE.RUNNING ||
    currentScenarioData?.state === SCENARIO_RUN_STATE.DATA_INGESTION_IN_PROGRESS;
  const isCurrentScenarioRejected = currentScenarioData?.validationStatus === SCENARIO_VALIDATION_STATUS.REJECTED;
  const isCurrentScenarioValidated = currentScenarioData?.validationStatus === SCENARIO_VALIDATION_STATUS.VALIDATED;
  const isEditDisabled =
    noTabsShown || isCurrentScenarioRunning || isCurrentScenarioRejected || isCurrentScenarioValidated;

  let disabledEditTooltip;
  if (isCurrentScenarioRunning) {
    disabledEditTooltip = t(
      'commoncomponents.button.scenario.parameters.disabledEditTooltip.running',
      'Parameters cannot be edited while the scenario is running'
    );
  } else if (isCurrentScenarioRejected) {
    disabledEditTooltip = t(
      'commoncomponents.button.scenario.parameters.disabledEditTooltip.rejected',
      'This scenario is rejected, you cannot edit its parameters'
    );
  } else if (isCurrentScenarioValidated) {
    disabledEditTooltip = t(
      'commoncomponents.button.scenario.parameters.disabledEditTooltip.validated',
      'This scenario is validated, you cannot edit its parameters'
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
      <Accordion expanded={accordionSummaryExpanded}>
        <AccordionSummary
          data-cy="scenario-params-accordion-summary"
          className={classes.accordionSummary}
          expandIcon={<ExpandMoreIcon />}
          onClick={handleSummaryClick}
        >
          <Grid container className={classes.gridContainerSummary}>
            <Grid className={classes.gridSummary}>
              <Typography>{t('genericcomponent.text.scenario.parameters.title', 'Scenario parameters')}</Typography>
            </Grid>
            <Grid item>
              {/* FIXME: add PLATFORM.ADMIN bypass */}
              <PermissionsGate
                userPermissions={userPermissionsOnCurrentScenario}
                necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.WRITE, ACL_PERMISSIONS.SCENARIO.LAUNCH]}
              >
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
                <ScenarioParametersTabsWrapper
                  parametersGroupsMetadata={parametersGroupsMetadata}
                  userRoles={userRoles}
                  context={context}
                />
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
  onChangeAccordionSummaryExpanded: PropTypes.func.isRequired,
  accordionSummaryExpanded: PropTypes.bool.isRequired,
};

export default ScenarioParameters;
