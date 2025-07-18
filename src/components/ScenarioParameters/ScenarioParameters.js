// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Grid2 as Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import rfdc from 'rfdc';
import { PermissionsGate } from '@cosmotech/ui';
import { RUNNER_VALIDATION_STATUS, RUNNER_RUN_STATE } from '../../services/config/ApiConstants';
import { STATUSES } from '../../services/config/StatusConstants';
import { ACL_PERMISSIONS } from '../../services/config/accessControl';
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
  accordionDetailsContent: {
    width: '100%',
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
  const isCurrentScenarioRunning = currentScenarioData?.state === RUNNER_RUN_STATE.RUNNING;
  const isCurrentScenarioRejected = currentScenarioData?.validationStatus === RUNNER_VALIDATION_STATUS.REJECTED;
  const isCurrentScenarioValidated = currentScenarioData?.validationStatus === RUNNER_VALIDATION_STATUS.VALIDATED;
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
            sx={{ flexDirection: 'row-reverse' }}
            expandIcon={<ExpandMoreIcon />}
            onClick={onToggleAccordion}
            component="div"
            role="button"
          >
            <Grid
              container
              size="grow"
              sx={{ direction: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Grid sx={{ ml: '10px' }}>
                <Typography>{t('genericcomponent.text.scenario.parameters.title', 'Scenario parameters')}</Typography>
              </Grid>
              <Grid container>
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
