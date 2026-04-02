// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useState, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import { Card, Divider, Grid, IconButton, Paper, Stack, Typography } from '@mui/material';
import { ScenarioValidationStatusChip, PermissionsGate, FadingTooltip } from '@cosmotech/ui';
import {
  ScenarioParameters,
  ShareCurrentScenarioButton,
  CreateScenarioButton,
  CurrentScenarioSelector,
} from '../../components';
import { useConfirmOnRouteChange, useRedirectionToScenario } from '../../hooks/RouterHooks';
import { RUNNER_VALIDATION_STATUS } from '../../services/config/ApiConstants.js';
import { ACL_PERMISSIONS } from '../../services/config/accessControl';
import RunnerService from '../../services/runner/RunnerService';
import { TranslationUtils } from '../../utils';
import { useScenario } from './ScenarioHook';
import { ScenarioDashboardCard, BackdropLoadingScenario, ComparisonScenarioPanel } from './components';

const STORAGE_SCENARIO_PARAMETERS_ACCORDION_EXPANDED_KEY = 'scenarioParametersAccordionExpanded';

const Scenario = () => {
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
    currentScenarioData,
    organizationId,
    workspaceId,
    setScenarioValidationStatus,
    setApplicationErrorMessage,
    currentScenarioDatasetName,
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

  const [isSplitView, setIsSplitView] = useState(false);
  const toggleSplitView = useCallback(() => setIsSplitView((prev) => !prev), []);

  const currentScenarioRenderInputTooltip = isDirty
    ? t(
        'views.scenario.dropdown.scenario.tooltip.disabled',
        'Please save or discard current modifications before selecting another scenario'
      )
    : '';

  const resetScenarioValidationStatus = async () => {
    const currentStatus = currentScenarioData.validationStatus;
    try {
      setScenarioValidationStatus(currentScenarioData.id, RUNNER_VALIDATION_STATUS.LOADING);
      await RunnerService.resetValidationStatus(
        organizationId,
        workspaceId,
        currentScenarioData.id,
        currentScenarioData.runTemplateId
      );
      setScenarioValidationStatus(currentScenarioData.id, RUNNER_VALIDATION_STATUS.DRAFT);
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
      setScenarioValidationStatus(currentScenarioData.id, RUNNER_VALIDATION_STATUS.LOADING);
      await RunnerService.setRunnerValidationStatusToValidated(
        organizationId,
        workspaceId,
        currentScenarioData.id,
        currentScenarioData.runTemplateId
      );
      setScenarioValidationStatus(currentScenarioData.id, RUNNER_VALIDATION_STATUS.VALIDATED);
    } catch (error) {
      setApplicationErrorMessage(
        error,
        t('commoncomponents.banner.validateScenario', 'A problem occurred during scenario validation.')
      );
      setScenarioValidationStatus(currentScenarioData.id, RUNNER_VALIDATION_STATUS.DRAFT);
    }
  };
  const rejectScenario = async () => {
    try {
      setScenarioValidationStatus(currentScenarioData.id, RUNNER_VALIDATION_STATUS.LOADING);
      await RunnerService.setRunnerValidationStatusToRejected(
        organizationId,
        workspaceId,
        currentScenarioData.id,
        currentScenarioData.runTemplateId
      );
      setScenarioValidationStatus(currentScenarioData.id, RUNNER_VALIDATION_STATUS.REJECTED);
    } catch (error) {
      setApplicationErrorMessage(
        error,
        t('commoncomponents.banner.rejectScenario', 'A problem occurred during scenario rejection.')
      );
      setScenarioValidationStatus(currentScenarioData.id, RUNNER_VALIDATION_STATUS.DRAFT);
    }
  };

  const scenarioValidationStatusLabels = {
    rejected: t('views.scenario.validation.rejected', 'Rejected'),
    validated: t('views.scenario.validation.validated', 'Validated'),
  };
  const currentScenarioValidationStatus = currentScenarioData?.validationStatus || RUNNER_VALIDATION_STATUS.UNKNOWN;
  const showValidationChip =
    [RUNNER_VALIDATION_STATUS.DRAFT, RUNNER_VALIDATION_STATUS.UNKNOWN].includes(currentScenarioValidationStatus) ===
    false;

  const validateButton = (
    <IconButton
      data-cy="validate-scenario-button"
      disabled={isDirty}
      color="primary"
      onClick={(event) => validateScenario()}
    >
      <CheckIcon />
    </IconButton>
  );
  const rejectButton = (
    <IconButton
      data-cy="reject-scenario-button"
      disabled={isDirty}
      color="primary"
      onClick={(event) => rejectScenario()}
    >
      <CloseIcon />
    </IconButton>
  );

  const validateButtonTooltipWrapper = (
    <FadingTooltip
      useSpan
      title={
        isDirty
          ? t(
              'views.scenario.validation.disabledTooltip',
              'Please save or discard current modifications before changing the scenario validation status'
            )
          : t('views.scenario.validation.validate', 'Validate')
      }
    >
      {validateButton}
    </FadingTooltip>
  );

  const rejectButtonTooltipWrapper = (
    <FadingTooltip
      useSpan
      title={
        isDirty
          ? t(
              'views.scenario.validation.disabledTooltip',
              'Please save or discard current modifications before changing the scenario validation status'
            )
          : t('views.scenario.validation.reject', 'Reject')
      }
    >
      {rejectButton}
    </FadingTooltip>
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

  const showDivider =
    currentScenarioData != null &&
    (userPermissionsOnCurrentScenario.includes(ACL_PERMISSIONS.RUNNER.VALIDATE) ||
      currentScenarioData?.validationStatus !== RUNNER_VALIDATION_STATUS.DRAFT);

  const validationAreaDivider = showDivider ? <Divider orientation="vertical" flexItem /> : null;

  return (
    <FormProvider {...methods} key={`form-${currentScenarioData?.id}`}>
      <BackdropLoadingScenario />
      <div data-cy="scenario-view" style={{ paddingTop: '16px', paddingLeft: '8px', paddingRight: '8px' }}>
        {isSplitView ? (
          /* ── Split view: two independent columns ── */
          <Stack spacing={2}>
            {/* Top action bar — full width */}
            <Grid container sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <Grid sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', gap: 0.5 }}>
                <FadingTooltip
                  title={t('views.scenario.splitView.tooltip', 'Close split view')}
                >
                  <IconButton
                    data-cy="split-view-button"
                    color="primary"
                    onClick={toggleSplitView}
                  >
                    <VerticalSplitIcon />
                  </IconButton>
                </FadingTooltip>
                <CreateScenarioButton disabled={isDirty} onScenarioCreated={onScenarioCreated} isIconButton />
                <ShareCurrentScenarioButton />
                {validationAreaDivider}
                {currentScenarioData && scenarioValidationArea}
              </Grid>
            </Grid>

            {/* Two-column split layout */}
            <Stack direction="row" spacing={0} sx={{ width: '100%' }}>
              {/* ── Left column: current scenario ── */}
              <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
                <Stack>
                  <CurrentScenarioSelector disabled={isDirty} renderInputToolTip={currentScenarioRenderInputTooltip} />
                  {currentScenarioData && (
                    <Stack direction="row" sx={{ justifyContent: 'center' }}>
                      <FadingTooltip
                        title={t(
                          TranslationUtils.getRunTemplateTranslationKey(currentScenarioData.runTemplateId),
                          currentScenarioData.runTemplateName
                        )}
                        useSpan
                        spanProps={{ style: { overflow: 'hidden' } }}
                      >
                        <Typography data-cy="run-template-name" align="center" noWrap color="text.secondary">
                          <Typography component="span" sx={{ fontWeight: '700' }}>
                            {t('views.scenario.text.scenariotype')}
                          </Typography>
                          :{' '}
                          {t(
                            TranslationUtils.getRunTemplateTranslationKey(currentScenarioData.runTemplateId),
                            currentScenarioData.runTemplateName
                          )}
                        </Typography>
                      </FadingTooltip>
                      <FadingTooltip
                        title={currentScenarioDatasetName}
                        useSpan
                        spanProps={{ style: { overflow: 'hidden' } }}
                      >
                        <Typography data-cy="dataset-name" align="center" noWrap color="text.secondary">
                          &nbsp;|&nbsp;
                          <Typography component="span" sx={{ fontWeight: '700' }}>
                            {t('commoncomponents.dialog.create.scenario.dropdown.dataset.label', 'Dataset')}:&nbsp;
                          </Typography>
                          {currentScenarioDatasetName}
                        </Typography>
                      </FadingTooltip>
                    </Stack>
                  )}
                </Stack>
                <Card component={Paper}>
                  {currentScenarioData && (
                    <ScenarioParameters
                      isAccordionExpanded={isScenarioParametersAccordionExpanded}
                      onToggleAccordion={toggleScenarioParametersAccordion}
                    />
                  )}
                </Card>
                <ScenarioDashboardCard />
              </Stack>

              {/* Vertical divider */}
              <Divider orientation="vertical" flexItem sx={{ mx: 1.5 }} />

              {/* ── Right column: comparison scenario ── */}
              <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
                <ComparisonScenarioPanel />
              </Stack>
            </Stack>
          </Stack>
        ) : (
          /* ── Normal single-scenario view ── */
          <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Grid size={4}>
              <Stack>
                <CurrentScenarioSelector disabled={isDirty} renderInputToolTip={currentScenarioRenderInputTooltip} />
                {currentScenarioData && (
                  <Stack direction="row" sx={{ justifyContent: 'center' }}>
                    <FadingTooltip
                      title={t(
                        TranslationUtils.getRunTemplateTranslationKey(currentScenarioData.runTemplateId),
                        currentScenarioData.runTemplateName
                      )}
                      useSpan
                      spanProps={{ style: { overflow: 'hidden' } }}
                    >
                      <Typography data-cy="run-template-name" align="center" noWrap color="text.secondary">
                        <Typography component="span" sx={{ fontWeight: '700' }}>
                          {t('views.scenario.text.scenariotype')}
                        </Typography>
                        :{' '}
                        {t(
                          TranslationUtils.getRunTemplateTranslationKey(currentScenarioData.runTemplateId),
                          currentScenarioData.runTemplateName
                        )}
                      </Typography>
                    </FadingTooltip>
                    <FadingTooltip
                      title={currentScenarioDatasetName}
                      useSpan
                      spanProps={{ style: { overflow: 'hidden' } }}
                    >
                      <Typography data-cy="dataset-name" align="center" noWrap color="text.secondary">
                        &nbsp;|&nbsp;
                        <Typography component="span" sx={{ fontWeight: '700' }}>
                          {t('commoncomponents.dialog.create.scenario.dropdown.dataset.label', 'Dataset')}:&nbsp;
                        </Typography>
                        {currentScenarioDatasetName}
                      </Typography>
                    </FadingTooltip>
                  </Stack>
                )}
              </Stack>
            </Grid>
            <Grid container sx={{ justifyContent: 'flex-end' }} size={3}>
              <Grid sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'flex-end' }}>
                <FadingTooltip
                  title={t('views.scenario.splitView.tooltip', 'Compare scenarios side by side')}
                >
                  <IconButton
                    data-cy="split-view-button"
                    color="default"
                    onClick={toggleSplitView}
                  >
                    <VerticalSplitIcon />
                  </IconButton>
                </FadingTooltip>
                <CreateScenarioButton disabled={isDirty} onScenarioCreated={onScenarioCreated} isIconButton />
                <ShareCurrentScenarioButton />
              </Grid>
              {validationAreaDivider}
              <Grid
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'nowrap',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                {currentScenarioData && scenarioValidationArea}
              </Grid>
            </Grid>
            <Grid size={12}>
              <Card component={Paper}>
                {currentScenarioData && (
                  <ScenarioParameters
                    isAccordionExpanded={isScenarioParametersAccordionExpanded}
                    onToggleAccordion={toggleScenarioParametersAccordion}
                  />
                )}
              </Card>
            </Grid>
            <Grid size="grow">
              <ScenarioDashboardCard />
            </Grid>
          </Grid>
        )}
      </div>
    </FormProvider>
  );
};

export default Scenario;
