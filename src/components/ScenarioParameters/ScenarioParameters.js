// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import rfdc from 'rfdc';
import { PermissionsGate } from '@cosmotech/ui';
import { SCENARIO_RUN_STATE, SCENARIO_VALIDATION_STATUS } from '../../services/config/ApiConstants';
import { ACL_PERMISSIONS } from '../../services/config/accessControl';
import { STATUSES } from '../../state/commons/Constants';
import { ScenarioParametersUtils } from '../../utils';
import { FileManagementUtils } from '../../utils/FileManagementUtils';
import { ScenarioResetValuesContext } from './ScenarioParametersContext';
import { useScenarioParameters } from './ScenarioParametersHook';
import { ScenarioParametersTabsWrapper, ScenarioActions } from './components';

const clone = rfdc();

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

const ScenarioParameters = ({ onToggleAccordion, isAccordionExpanded }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    runTemplateParametersIds,
    parametersMetadata,
    datasets,
    currentScenario,
    solutionData,
    userRoles,
    userPermissionsOnCurrentScenario,
    isDarkTheme,
  } = useScenarioParameters();
  const scenarioStatus = currentScenario?.status;
  const currentScenarioData = currentScenario?.data;
  const scenarioId = currentScenarioData?.id;

  const { reset, getValues } = useFormContext();

  // Memoize default values for run template parameters, based on solutionData description
  const defaultParametersValues = useMemo(
    () => ScenarioParametersUtils.getDefaultParametersValues(runTemplateParametersIds, solutionData?.parameters),
    [runTemplateParametersIds, solutionData?.parameters]
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
        datasets,
        runTemplateParametersIds,
        defaultParametersValues,
        currentScenarioData?.parametersValues
      ),
    [datasets, runTemplateParametersIds, defaultParametersValues, currentScenarioData?.parametersValues]
  );

  const generateParametersValuesFromOriginalValues = useCallback(() => {
    return ScenarioParametersUtils.buildParametersValuesFromOriginalValues(
      parametersValuesForReset,
      parametersMetadata,
      datasets,
      FileManagementUtils.buildClientFileDescriptorFromDataset
    );
  }, [datasets, parametersMetadata, parametersValuesForReset]);

  const scenarioResetValues = useMemo(
    () => generateParametersValuesFromOriginalValues(),

    [generateParametersValuesFromOriginalValues]
  );

  const resetParametersValues = useCallback(() => {
    reset(clone(scenarioResetValues));
  }, [reset, scenarioResetValues]);

  const discardLocalChanges = useCallback(() => {
    resetParametersValues();
  }, [resetParametersValues]);

  useEffect(() => {
    discardLocalChanges();
    // eslint-disable-next-line
  }, [scenarioId]);

  // The useEffect below is currently necessary to prevent a glitch when saving scenario parameters values (without it,
  // the table content briefly shows the previous rows before displaying the new ones)
  useEffect(() => {
    if (scenarioStatus === STATUSES.SUCCESS) reset({ ...getValues() });
    // eslint-disable-next-line
  }, [scenarioStatus]);

  const preventSubmit = (event) => {
    event.preventDefault();
  };

  const noTabsShown = parametersGroupsMetadata.length === 0;
  const isCurrentScenarioRunning =
    currentScenarioData?.state === SCENARIO_RUN_STATE.RUNNING ||
    currentScenarioData?.state === SCENARIO_RUN_STATE.DATA_INGESTION_IN_PROGRESS;
  const isCurrentScenarioRejected = currentScenarioData?.validationStatus === SCENARIO_VALIDATION_STATUS.REJECTED;
  const isCurrentScenarioValidated = currentScenarioData?.validationStatus === SCENARIO_VALIDATION_STATUS.VALIDATED;
  const hasUserWritePermission = userPermissionsOnCurrentScenario.includes(ACL_PERMISSIONS.SCENARIO.WRITE);

  // You can use the context object to pass all additional information to custom tab factory
  const context = {
    isDarkTheme,
    editMode: !(
      noTabsShown ||
      isCurrentScenarioRunning ||
      isCurrentScenarioRejected ||
      isCurrentScenarioValidated ||
      !hasUserWritePermission
    ),
    targetDatasetId: currentScenarioData?.datasetList?.[0],
  };

  return (
    <div>
      <ScenarioResetValuesContext.Provider value={scenarioResetValues}>
        <Accordion data-cy="scenario-params-accordion" expanded={isAccordionExpanded}>
          <AccordionSummary
            data-cy="scenario-params-accordion-summary"
            className={classes.accordionSummary}
            expandIcon={<ExpandMoreIcon />}
            onClick={onToggleAccordion}
          >
            <Grid container className={classes.gridContainerSummary}>
              <Grid className={classes.gridSummary}>
                <Typography>{t('genericcomponent.text.scenario.parameters.title', 'Scenario parameters')}</Typography>
              </Grid>
              <Grid item>
                {/* FIXME: add PLATFORM.ADMIN bypass */}
                <ScenarioActions />
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.accordionDetailsContent}>
              {
                <form onSubmit={preventSubmit}>
                  <PermissionsGate
                    userPermissions={userPermissionsOnCurrentScenario}
                    necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.LAUNCH]}
                    noPermissionProps={{ context: { ...context, isReadOnly: true } }}
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
      </ScenarioResetValuesContext.Provider>
    </div>
  );
};

ScenarioParameters.propTypes = {
  onToggleAccordion: PropTypes.func.isRequired,
  isAccordionExpanded: PropTypes.bool.isRequired,
};

export default ScenarioParameters;
