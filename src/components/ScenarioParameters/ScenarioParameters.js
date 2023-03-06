// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { SimpleTwoActionsDialog, PermissionsGate } from '@cosmotech/ui';
import makeStyles from '@mui/styles/makeStyles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SCENARIO_RUN_STATE, SCENARIO_VALIDATION_STATUS } from '../../services/config/ApiConstants';
import { STATUSES } from '../../state/commons/Constants';
import { ACL_PERMISSIONS } from '../../services/config/accessControl';
import { SaveLaunchDiscardButton, ScenarioParametersTabsWrapper } from './components';
import { useTranslation } from 'react-i18next';
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

const ScenarioResetValuesContext = React.createContext();

const ScenarioParameters = ({ onChangeAccordionSummaryExpanded, accordionSummaryExpanded }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    scenariosData,
    datasetsData,
    addDatasetToStore,
    currentScenario,
    currentScenarioData,
    organizationId,
    workspaceId,
    solutionData,
    userRoles,
    launchScenario,
    saveScenario,
    saveAndLaunchScenario,
    userPermissionsOnCurrentScenario,
    isDarkTheme,
  } = useScenarioParameters();
  const scenarioStatus = currentScenario?.status;
  const scenarioId = currentScenarioData?.id;

  const {
    reset,
    getValues,
    setValue,
    formState: { isDirty, dirtyFields },
  } = useFormContext();

  useEffect(() => {
    console.log(dirtyFields);
    console.log(isDirty);
  }, [isDirty, dirtyFields]);

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

  const generateParametersValuesFromOriginalValues = useCallback(() => {
    return ScenarioParametersUtils.buildParametersValuesFromOriginalValues(
      parametersValuesForReset,
      parametersMetadata,
      datasetsData,
      FileManagementUtils.buildClientFileDescriptorFromDataset
    );
  }, [datasetsData, parametersMetadata, parametersValuesForReset]);

  const scenarioResetValues = useMemo(
    () => generateParametersValuesFromOriginalValues(),

    [generateParametersValuesFromOriginalValues]
  );

  const resetParametersValues = useCallback(() => {
    reset(scenarioResetValues);
  }, [reset, scenarioResetValues]);

  const discardLocalChanges = useCallback(() => {
    resetParametersValues();
  }, [resetParametersValues]);

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
    isDarkTheme,
    isReadOnly: false,
  };

  useEffect(() => {
    discardLocalChanges();
    // eslint-disable-next-line
  }, [scenarioId]);

  useEffect(() => {
    if (scenarioStatus === STATUSES.SUCCESS) reset({ ...getValues() });
    // eslint-disable-next-line
  }, [scenarioStatus]);

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

  const updateBeforeLaunch = useRef(null);

  const scenarioLaunch = (event, updateBeforeLaunch_) => {
    event.stopPropagation();
    updateBeforeLaunch.current = updateBeforeLaunch_;
    startScenarioLaunch();
  };

  const scenarioSave = async (event) => {
    event.stopPropagation();
    saveScenario(scenarioId, getParametersForUpdate());
  };

  const startScenarioLaunch = async () => {
    const forceUpdate = ScenarioParametersUtils.shouldForceScenarioParametersUpdate(runTemplateParametersIds);
    await processScenarioLaunch(forceUpdate || updateBeforeLaunch.current);
  };

  const processScenarioLaunch = async (updateBeforeLaunch) => {
    // If scenario parameters have never been updated, force parameters update
    if (!currentScenarioData?.parametersValues || currentScenarioData?.parametersValues.length === 0) {
      updateBeforeLaunch = true;
    }

    await processFilesParameters();
    if (updateBeforeLaunch) {
      saveAndLaunchScenario(scenarioId, getParametersForUpdate());
    } else {
      launchScenario(scenarioId);
    }
    reset({ ...getValues() });
  };

  const preventSubmit = (event) => {
    event.preventDefault();
  };

  const [showDiscardConfirmationPopup, setShowDiscardConfirmationPopup] = useState(false);

  const askDiscardConfirmation = (event) => {
    event.stopPropagation();
    setShowDiscardConfirmationPopup(true);
  };

  const confirmDiscard = () => {
    setShowDiscardConfirmationPopup(false);
    discardLocalChanges();
  };

  const cancelDiscard = () => {
    setShowDiscardConfirmationPopup(false);
  };

  const noTabsShown = parametersGroupsMetadata.length === 0;
  const isCurrentScenarioRunning =
    currentScenarioData?.state === SCENARIO_RUN_STATE.RUNNING ||
    currentScenarioData?.state === SCENARIO_RUN_STATE.DATA_INGESTION_IN_PROGRESS;
  const isCurrentScenarioRejected = currentScenarioData?.validationStatus === SCENARIO_VALIDATION_STATUS.REJECTED;
  const isCurrentScenarioValidated = currentScenarioData?.validationStatus === SCENARIO_VALIDATION_STATUS.VALIDATED;

  // console.log(currentScenarioStatus);
  // console.log(isCurrentScenarioSaving);

  context.isReadOnly =
    noTabsShown || isCurrentScenarioRunning || isCurrentScenarioRejected || isCurrentScenarioValidated;

  const handleSummaryClick = () => {
    const expandedNewState = !accordionSummaryExpanded;
    localStorage.setItem('scenarioParametersAccordionExpanded', expandedNewState);
    onChangeAccordionSummaryExpanded(expandedNewState);
  };

  return (
    <div>
      <ScenarioResetValuesContext.Provider value={scenarioResetValues}>
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
            </Grid>
            <Grid item>
              {/* FIXME: add PLATFORM.ADMIN bypass */}
              <SaveLaunchDiscardButton
                save={(event) => scenarioSave(event)}
                discard={askDiscardConfirmation}
                launch={(event) => scenarioLaunch(event, false)}
                saveAndLauch={(event) => scenarioLaunch(event, true)}
                isDirty={isDirty}
                runDisabled={isCurrentScenarioRunning}
              />
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.accordionDetailsContent}>
              {
                <form onSubmit={preventSubmit}>
                  <PermissionsGate
                    userPermissions={userPermissionsOnCurrentScenario}
                    necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.LAUNCH]}
                    RenderNoPermissionComponent={() => (
                      <ScenarioParametersTabsWrapper
                        parametersGroupsMetadata={parametersGroupsMetadata}
                        userRoles={userRoles}
                        context={{ ...context, isReadOnly: true }}
                      />
                    )}
                  >
                    <ScenarioParametersTabsWrapper
                      parametersGroupsMetadata={parametersGroupsMetadata}
                      userRoles={userRoles}
                      context={context}
                    />
                  </PermissionsGate>
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
      </ScenarioResetValuesContext.Provider>
    </div>
  );
};

ScenarioParameters.propTypes = {
  onChangeAccordionSummaryExpanded: PropTypes.func.isRequired,
  accordionSummaryExpanded: PropTypes.bool.isRequired,
};

export default ScenarioParameters;
export const useScenarioResetValues = () => {
  return useContext(ScenarioResetValuesContext);
};
