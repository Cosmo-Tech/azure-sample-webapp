// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useState, useCallback } from 'react';
import { Backdrop, Button, Card, CircularProgress, Grid, Paper, Tooltip, Typography } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { ScenarioParameters, ShareCurrentScenarioButton, CreateScenarioButton } from '../../components';
import { useTranslation } from 'react-i18next';
import { HierarchicalComboBox, ScenarioValidationStatusChip, PermissionsGate } from '@cosmotech/ui';
import { sortScenarioList } from '../../utils/SortScenarioListUtils';
import { SCENARIO_VALIDATION_STATUS } from '../../services/config/ApiConstants.js';
import ScenarioService from '../../services/scenario/ScenarioService';
import { STATUSES } from '../../state/commons/Constants';
import { AppInsights } from '../../services/AppInsights';
import { ACL_PERMISSIONS } from '../../services/config/accessControl';
import { ScenarioDashboardCard } from './components';
import { makeStyles } from '@mui/styles';
import { useScenario } from './ScenarioHook';
import { useRedirectionToScenario } from '../../hooks/RouterHooks';

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
  const methods = useForm();

  const {
    scenarioList,
    currentScenario,
    currentScenarioRun,
    currentScenarioRunId,
    organizationId,
    workspaceId,
    setScenarioValidationStatus,
    findScenarioById,
    setApplicationErrorMessage,
    fetchScenarioRunById,
  } = useScenario();

  const [editMode, setEditMode] = useState(false);

  const [isScenarioParametersAccordionExpanded, setIsScenarioParametersAccordionExpanded] = useState(
    localStorage.getItem(STORAGE_SCENARIO_PARAMETERS_ACCORDION_EXPANDED_KEY) === 'true'
  );

  const handleScenarioChange = (event, scenario) => {
    findScenarioById(scenario.id);
  };

  const toggleScenarioParametersAccordion = () => {
    const isExpanded = !isScenarioParametersAccordionExpanded;
    setIsScenarioParametersAccordionExpanded(isExpanded);
    localStorage.setItem(STORAGE_SCENARIO_PARAMETERS_ACCORDION_EXPANDED_KEY, isExpanded);
  };

  const onScenarioCreated = useCallback(() => {
    setIsScenarioParametersAccordionExpanded(true);
    localStorage.setItem(STORAGE_SCENARIO_PARAMETERS_ACCORDION_EXPANDED_KEY, true);
  }, []);

  const currentScenarioRenderInputTooltip = editMode
    ? t(
        'views.scenario.dropdown.scenario.tooltip.disabled',
        'Please save or discard current modifications before selecting another scenario'
      )
    : '';

  useEffect(() => {
    appInsights.setScenarioData(currentScenario.data);
  }, [currentScenario]);

  useEffect(() => {
    if (currentScenarioRunId != null && currentScenarioRun == null) fetchScenarioRunById(currentScenarioRunId);
  }, [currentScenarioRunId, currentScenarioRun, fetchScenarioRunById]);

  const sortedScenarioList = sortScenarioList(scenarioList.data.slice());
  const noScenario = currentScenario.data === null;
  const scenarioListDisabled = editMode || scenarioList === null || noScenario;
  const scenarioListLabel = noScenario ? null : t('views.scenario.dropdown.scenario.label', 'Scenario');
  const showBackdrop = currentScenario.status === STATUSES.LOADING;

  useRedirectionToScenario(sortedScenarioList);

  const resetScenarioValidationStatus = async () => {
    const currentStatus = currentScenario.data.validationStatus;
    try {
      setScenarioValidationStatus(currentScenario.data.id, SCENARIO_VALIDATION_STATUS.LOADING);
      await ScenarioService.resetValidationStatus(organizationId, workspaceId, currentScenario.data.id);
      findScenarioById(currentScenario.data.id);
    } catch (error) {
      setApplicationErrorMessage(
        error,
        t('commoncomponents.banner.resetStatusValidation', 'A problem occurred during validation status reset.')
      );
      setScenarioValidationStatus(currentScenario.data.id, currentStatus);
    }
  };
  const validateScenario = async () => {
    try {
      setScenarioValidationStatus(currentScenario.data.id, SCENARIO_VALIDATION_STATUS.LOADING);
      await ScenarioService.setScenarioValidationStatusToValidated(
        organizationId,
        workspaceId,
        currentScenario.data.id
      );
      findScenarioById(currentScenario.data.id);
    } catch (error) {
      setApplicationErrorMessage(
        error,
        t('commoncomponents.banner.validateScenario', 'A problem occurred during scenario validation.')
      );
      setScenarioValidationStatus(currentScenario.data.id, SCENARIO_VALIDATION_STATUS.DRAFT);
    }
  };
  const rejectScenario = async () => {
    try {
      setScenarioValidationStatus(currentScenario.data.id, SCENARIO_VALIDATION_STATUS.LOADING);
      await ScenarioService.setScenarioValidationStatusToRejected(organizationId, workspaceId, currentScenario.data.id);
      findScenarioById(currentScenario.data.id);
    } catch (error) {
      setApplicationErrorMessage(
        error,
        t('commoncomponents.banner.rejectScenario', 'A problem occurred during scenario rejection.')
      );
      setScenarioValidationStatus(currentScenario.data.id, SCENARIO_VALIDATION_STATUS.DRAFT);
    }
  };

  const scenarioValidationStatusLabels = {
    rejected: t('views.scenario.validation.rejected', 'Rejected'),
    validated: t('views.scenario.validation.validated', 'Validated'),
  };
  const currentScenarioValidationStatus = currentScenario?.data?.validationStatus || SCENARIO_VALIDATION_STATUS.UNKNOWN;
  const showValidationChip =
    [SCENARIO_VALIDATION_STATUS.DRAFT, SCENARIO_VALIDATION_STATUS.UNKNOWN].includes(currentScenarioValidationStatus) ===
    false;

  const validateButton = (
    <Button
      className={classes.rightButton}
      data-cy="validate-scenario-button"
      disabled={editMode}
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
      disabled={editMode}
      variant="outlined"
      color="primary"
      onClick={(event) => rejectScenario()}
    >
      {t('views.scenario.validation.reject', 'Reject')}
    </Button>
  );

  const validateButtonTooltipWrapper = editMode ? (
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

  const rejectButtonTooltipWrapper = editMode ? (
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

  const userPermissionsOnCurrentScenario = currentScenario?.data?.security?.currentUserPermissions || [];
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

  const hierarchicalComboBoxLabels = {
    label: scenarioListLabel,
    validationStatus: scenarioValidationStatusLabels,
  };

  return (
    <FormProvider {...methods}>
      <Backdrop open={showBackdrop} style={{ zIndex: '10000' }}>
        <CircularProgress data-cy="scenario-loading-spinner" color="inherit" />
      </Backdrop>
      <div data-cy="scenario-view" className={classes.content}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <div>
              <Grid container spacing={1} alignItems="center" justifyContent="flex-start">
                <Grid item>
                  <CreateScenarioButton disabled={editMode} onScenarioCreated={onScenarioCreated} />
                </Grid>
                <Grid item>
                  <ShareCurrentScenarioButton />
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={4}>
            <Grid container direction="column">
              <HierarchicalComboBox
                value={currentScenario.data}
                values={sortedScenarioList}
                labels={hierarchicalComboBoxLabels}
                handleChange={handleScenarioChange}
                disabled={scenarioListDisabled}
                renderInputToolType={currentScenarioRenderInputTooltip}
              />
              {currentScenario.data && (
                <Typography
                  data-cy="run-template-name"
                  variant="caption"
                  align="center"
                  className={classes.runTemplate}
                >
                  {t('views.scenario.text.scenariotype')}: {currentScenario.data.runTemplateName}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid item xs={4} className={classes.alignRight}>
            {currentScenario.data && scenarioValidationArea}
          </Grid>
          <Grid item xs={12}>
            <Card component={Paper}>
              {currentScenario.data && (
                <ScenarioParameters
                  editMode={editMode}
                  changeEditMode={setEditMode}
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
