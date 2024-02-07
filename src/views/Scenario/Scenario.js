// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useState, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Card, Grid, Paper, Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ScenarioValidationStatusChip, PermissionsGate } from '@cosmotech/ui';
import {
  ScenarioParameters,
  ShareCurrentScenarioButton,
  CreateScenarioButton,
  CurrentScenarioSelector,
} from '../../components';
import { useConfirmOnRouteChange, useRedirectionToScenario } from '../../hooks/RouterHooks';
import { AppInsights } from '../../services/AppInsights';
import { SCENARIO_VALIDATION_STATUS } from '../../services/config/ApiConstants.js';
import { ACL_PERMISSIONS } from '../../services/config/accessControl';
import ScenarioService from '../../services/scenario/ScenarioService';
import { TranslationUtils } from '../../utils/TranslationUtils';
import { useScenario } from './ScenarioHook';
import { ScenarioDashboardCard, BackdropLoadingScenario } from './components';

const useStyles = makeStyles((theme) => ({
  content: {
    paddingTop: '16px',
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  rightButton: {
    marginLeft: '8px',
  },
  alignRight: {
    textAlign: 'right',
  },
  runTemplate: {
    color: theme.palette.text.secondary,
  },
}));

const appInsights = AppInsights.getInstance();

const STORAGE_SCENARIO_PARAMETERS_ACCORDION_EXPANDED_KEY = 'scenarioParametersAccordionExpanded';

const Scenario = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  // RHF
  const methods = useForm({ mode: 'onChange' });
  const { isDirty } = methods.formState;

  const confirmDiscardDialogProps = {
    id: 'discard-and-continue',
    labels: {
      title: t('genericcomponent.dialog.scenario.discardUnsaved.title'),
      body: t('genericcomponent.dialog.scenario.discardUnsaved.body'),
      button1: t('genericcomponent.dialog.scenario.discardUnsaved.buttons.cancel'),
      button2: t('genericcomponent.dialog.scenario.discardUnsaved.buttons.discardAndContinue'),
    },
    dialogProps: {
      maxWidth: 'sm',
    },
    button2Props: {
      color: 'error',
    },
    closeOnBackdropClick: true,
  };

  useRedirectionToScenario();
  useConfirmOnRouteChange(confirmDiscardDialogProps, isDirty);

  const {
    currentScenarioRun,
    currentScenarioRunId,
    currentScenarioData,
    organizationId,
    workspaceId,
    setScenarioValidationStatus,
    findScenarioById,
    setApplicationErrorMessage,
    fetchScenarioRunById,
  } = useScenario();

  // Add accordion expand status in state
  const [isScenarioParametersAccordionExpanded, setIsScenarioParametersAccordionExpanded] = useState(
    localStorage.getItem(STORAGE_SCENARIO_PARAMETERS_ACCORDION_EXPANDED_KEY) === 'true'
  );

  const toggleScenarioParametersAccordion = useCallback(() => {
    const isExpanded = !isScenarioParametersAccordionExpanded;
    setIsScenarioParametersAccordionExpanded(isExpanded);
    localStorage.setItem(STORAGE_SCENARIO_PARAMETERS_ACCORDION_EXPANDED_KEY, isExpanded);
  }, [isScenarioParametersAccordionExpanded]);

  const onScenarioCreated = useCallback(() => {
    setIsScenarioParametersAccordionExpanded(true);
    localStorage.setItem(STORAGE_SCENARIO_PARAMETERS_ACCORDION_EXPANDED_KEY, true);
  }, []);

  const currentScenarioRenderInputTooltip = isDirty
    ? t(
        'views.scenario.dropdown.scenario.tooltip.disabled',
        'Please save or discard current modifications before selecting another scenario'
      )
    : '';

  useEffect(() => {
    appInsights.setScenarioData(currentScenarioData);
  }, [currentScenarioData]);

  useEffect(() => {
    if (currentScenarioRunId != null && currentScenarioRun == null) fetchScenarioRunById(currentScenarioRunId);
  }, [currentScenarioRunId, currentScenarioRun, fetchScenarioRunById]);

  const resetScenarioValidationStatus = async () => {
    const currentStatus = currentScenarioData.validationStatus;
    try {
      setScenarioValidationStatus(currentScenarioData.id, SCENARIO_VALIDATION_STATUS.LOADING);
      await ScenarioService.resetValidationStatus(organizationId, workspaceId, currentScenarioData.id);
      findScenarioById(currentScenarioData.id);
    } catch (error) {
      setApplicationErrorMessage(
        error,
        t('commoncomponents.banner.resetStatusValidation', 'A problem occurred during validation status reset.')
      );
      setScenarioValidationStatus(currentScenarioData.id, currentStatus);
    }
  };
  const validateScenario = async () => {
    try {
      setScenarioValidationStatus(currentScenarioData.id, SCENARIO_VALIDATION_STATUS.LOADING);
      await ScenarioService.setScenarioValidationStatusToValidated(organizationId, workspaceId, currentScenarioData.id);
      findScenarioById(currentScenarioData.id);
    } catch (error) {
      setApplicationErrorMessage(
        error,
        t('commoncomponents.banner.validateScenario', 'A problem occurred during scenario validation.')
      );
      setScenarioValidationStatus(currentScenarioData.id, SCENARIO_VALIDATION_STATUS.DRAFT);
    }
  };
  const rejectScenario = async () => {
    try {
      setScenarioValidationStatus(currentScenarioData.id, SCENARIO_VALIDATION_STATUS.LOADING);
      await ScenarioService.setScenarioValidationStatusToRejected(organizationId, workspaceId, currentScenarioData.id);
      findScenarioById(currentScenarioData.id);
    } catch (error) {
      setApplicationErrorMessage(
        error,
        t('commoncomponents.banner.rejectScenario', 'A problem occurred during scenario rejection.')
      );
      setScenarioValidationStatus(currentScenarioData.id, SCENARIO_VALIDATION_STATUS.DRAFT);
    }
  };

  const scenarioValidationStatusLabels = {
    rejected: t('views.scenario.validation.rejected', 'Rejected'),
    validated: t('views.scenario.validation.validated', 'Validated'),
  };
  const currentScenarioValidationStatus = currentScenarioData?.validationStatus || SCENARIO_VALIDATION_STATUS.UNKNOWN;
  const showValidationChip =
    [SCENARIO_VALIDATION_STATUS.DRAFT, SCENARIO_VALIDATION_STATUS.UNKNOWN].includes(currentScenarioValidationStatus) ===
    false;

  const validateButton = (
    <Button
      className={classes.rightButton}
      data-cy="validate-scenario-button"
      disabled={isDirty}
      variant="outlined"
      color="primary"
      onClick={(event) => validateScenario()}
    >
      {t('views.scenario.validation.validate', 'Validate')}
    </Button>
  );
  const rejectButton = (
    <Button
      className={classes.rightButton}
      data-cy="reject-scenario-button"
      disabled={isDirty}
      variant="outlined"
      color="primary"
      onClick={(event) => rejectScenario()}
    >
      {t('views.scenario.validation.reject', 'Reject')}
    </Button>
  );

  const validateButtonTooltipWrapper = isDirty ? (
    <Tooltip
      title={t(
        'views.scenario.validation.disabledTooltip',
        'Please save or discard current modifications before changing the scenario validation status'
      )}
    >
      <span>{validateButton}</span>
    </Tooltip>
  ) : (
    validateButton
  );

  const rejectButtonTooltipWrapper = isDirty ? (
    <Tooltip
      title={t(
        'views.scenario.validation.disabledTooltip',
        'Please save or discard current modifications before changing the scenario validation status'
      )}
    >
      <span>{rejectButton}</span>
    </Tooltip>
  ) : (
    rejectButton
  );

  const userPermissionsOnCurrentScenario = currentScenarioData?.security?.currentUserPermissions || [];
  const validationStatusButtons = (
    <PermissionsGate
      userPermissions={userPermissionsOnCurrentScenario}
      necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.VALIDATE]}
    >
      {validateButtonTooltipWrapper}
      {rejectButtonTooltipWrapper}
    </PermissionsGate>
  );

  const scenarioValidationStatusChip = (
    <PermissionsGate
      userPermissions={userPermissionsOnCurrentScenario}
      necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.VALIDATE]}
      noPermissionProps={{
        onDelete: null, // Prevent status edition if user has insufficient privileges
      }}
    >
      <ScenarioValidationStatusChip
        status={currentScenarioValidationStatus}
        onDelete={resetScenarioValidationStatus}
        labels={scenarioValidationStatusLabels}
      />
    </PermissionsGate>
  );

  const scenarioValidationArea = showValidationChip ? scenarioValidationStatusChip : validationStatusButtons;

  return (
    <FormProvider {...methods}>
      <BackdropLoadingScenario />
      <div data-cy="scenario-view" className={classes.content}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <div>
              <Grid container spacing={1} alignItems="center" justifyContent="flex-start">
                <Grid item>
                  <CreateScenarioButton disabled={isDirty} onScenarioCreated={onScenarioCreated} />
                </Grid>
                <Grid item>
                  <ShareCurrentScenarioButton />
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={4}>
            <Grid container direction="column">
              <CurrentScenarioSelector disabled={isDirty} renderInputToolTip={currentScenarioRenderInputTooltip} />
              {currentScenarioData && (
                <Typography data-cy="run-template-name" variant="body1" align="center" className={classes.runTemplate}>
                  {t('views.scenario.text.scenariotype')}:{' '}
                  {t(
                    TranslationUtils.getRunTemplateTranslationKey(currentScenarioData.runTemplateId),
                    currentScenarioData.runTemplateName
                  )}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid item xs={4} className={classes.alignRight}>
            {currentScenarioData && scenarioValidationArea}
          </Grid>
          <Grid item xs={12}>
            <Card component={Paper}>
              {currentScenarioData && (
                <ScenarioParameters
                  isAccordionExpanded={isScenarioParametersAccordionExpanded}
                  onToggleAccordion={toggleScenarioParametersAccordion}
                />
              )}
            </Card>
          </Grid>
          <Grid item xs={12}>
            <ScenarioDashboardCard />
          </Grid>
        </Grid>
      </div>
    </FormProvider>
  );
};

export default Scenario;
