// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Backdrop, Button, Card, CircularProgress, Grid, Tooltip, Typography } from '@material-ui/core';
import { ScenarioParameters } from '../../components';
import { useTranslation } from 'react-i18next';
import {
  CreateScenarioButton,
  HierarchicalComboBox,
  ScenarioValidationStatusChip,
  SimplePowerBIReportEmbed,
} from '@cosmotech/ui';
import { NAME_VALIDATOR } from '../../utils/ValidationUtils';
import { sortScenarioList } from '../../utils/SortScenarioListUtils';
import { LOG_TYPES } from '../../services/scenarioRun/ScenarioRunConstants.js';
import { SCENARIO_VALIDATION_STATUS } from '../../services/config/ApiConstants.js';
import {
  SCENARIO_RUN_LOG_TYPE,
  USE_POWER_BI_WITH_USER_CREDENTIALS,
  SCENARIO_VIEW_IFRAME_DISPLAY_RATIO,
} from '../../config/AppConfiguration';
import { SCENARIO_DASHBOARD_CONFIG } from '../../config/Dashboards';
import ScenarioService from '../../services/scenario/ScenarioService';
import ScenarioRunService from '../../services/scenarioRun/ScenarioRunService';
import { STATUSES } from '../../state/commons/Constants';
import { AppInsights } from '../../services/AppInsights';
import { PERMISSIONS } from '../../services/config/Permissions';
import { PermissionsGate } from '../../components/PermissionsGate';
import { getCreateScenarioDialogLabels, getReportLabels } from './labels';
import useStyles from './style';

const appInsights = AppInsights.getInstance();

const Scenario = (props) => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  const {
    setScenarioValidationStatus,
    setCurrentScenario,
    currentScenario,
    scenarioList,
    findScenarioById,
    datasetList,
    user,
    workspace,
    solution,
    addDatasetToStore,
    createScenario,
    updateAndLaunchScenario,
    launchScenario,
    reports,
    catchNonCriticalErrors,
  } = props;

  const workspaceId = workspace.data.id;
  const [editMode, setEditMode] = useState(false);

  const createScenarioDialogLabels = getCreateScenarioDialogLabels(t, editMode);
  const reportLabels = getReportLabels(t);

  // Add accordion expand status in state
  const [accordionSummaryExpanded, setAccordionSummaryExpanded] = useState(
    localStorage.getItem('scenarioParametersAccordionExpanded') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('scenarioParametersAccordionExpanded', accordionSummaryExpanded);
  }, [accordionSummaryExpanded]);

  useEffect(() => {
    if (currentScenario.data === null && sortedScenarioList.length > 0) {
      setCurrentScenario(sortedScenarioList[0]);
    }
  });
  const expandParametersAndCreateScenario = (workspaceId, scenarioData) => {
    createScenario(workspaceId, scenarioData);
    setAccordionSummaryExpanded(true);
  };

  const currentScenarioRenderInputTooltip = editMode
    ? t(
        'views.scenario.dropdown.scenario.tooltip.disabled',
        'Please save or discard current modifications before selecting another scenario'
      )
    : '';

  const handleScenarioChange = (event, scenario) => {
    findScenarioById(workspaceId, scenario.id);
  };

  useEffect(() => {
    appInsights.setScenarioData(currentScenario.data);
  }, [currentScenario]);

  const sortedScenarioList = sortScenarioList(scenarioList.data.slice());
  const noScenario = currentScenario.data === null;
  const scenarioListDisabled = editMode || scenarioList === null || noScenario;
  const scenarioListLabel = noScenario ? null : t('views.scenario.dropdown.scenario.label', 'Scenario');
  const showBackdrop = currentScenario.status === STATUSES.LOADING;

  let filteredRunTemplates = solution?.data?.runTemplates || [];
  const solutionRunTemplates = workspace.data?.solution?.runTemplateFilter;
  if (solutionRunTemplates) {
    filteredRunTemplates = filteredRunTemplates.filter(
      (runTemplate) => solutionRunTemplates.indexOf(runTemplate.id) !== -1
    );
  }

  const resetScenarioValidationStatus = async () => {
    const currentStatus = currentScenario.data.validationStatus;
    try {
      setScenarioValidationStatus(currentScenario.data.id, SCENARIO_VALIDATION_STATUS.LOADING);
      await ScenarioService.resetValidationStatus(workspaceId, currentScenario.data.id);
      findScenarioById(workspaceId, currentScenario.data.id);
    } catch (error) {
      catchNonCriticalErrors(error, 'Impossible to reset validation');
      setScenarioValidationStatus(
        currentScenario.data.id,
        currentStatus === 'Validated' ? SCENARIO_VALIDATION_STATUS.VALIDATED : SCENARIO_VALIDATION_STATUS.REJECTED
      );
    }
  };
  const validateScenario = async () => {
    try {
      setScenarioValidationStatus(currentScenario.data.id, SCENARIO_VALIDATION_STATUS.LOADING);
      await ScenarioService.setScenarioValidationStatusToValidated(workspaceId, currentScenario.data.id);
      findScenarioById(workspaceId, currentScenario.data.id);
    } catch (error) {
      catchNonCriticalErrors(error, 'Impossible to validate the scenario');
      setScenarioValidationStatus(currentScenario.data.id, SCENARIO_VALIDATION_STATUS.DRAFT);
    }
  };
  const rejectScenario = async () => {
    try {
      setScenarioValidationStatus(currentScenario.data.id, SCENARIO_VALIDATION_STATUS.LOADING);
      await ScenarioService.setScenarioValidationStatusToRejected(workspaceId, currentScenario.data.id);
      findScenarioById(workspaceId, currentScenario.data.id);
    } catch (error) {
      catchNonCriticalErrors(error, 'Impossible to reject the scenario');
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
      className={classes.scenarioValidationButton}
      data-cy="validate-scenario-button"
      disabled={editMode}
      size="small"
      variant="contained"
      color="primary"
      onClick={(event) => validateScenario()}
    >
      {t('views.scenario.validation.validate', 'Validate')}
    </Button>
  );
  const rejectButton = (
    <Button
      className={classes.scenarioValidationButton}
      data-cy="reject-scenario-button"
      disabled={editMode}
      size="small"
      variant="contained"
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

  const validationStatusButtons = (
    <PermissionsGate authorizedPermissions={[PERMISSIONS.canChangeScenarioValidationStatus]}>
      {validateButtonTooltipWrapper}
      {rejectButtonTooltipWrapper}
    </PermissionsGate>
  );

  const scenarioValidationStatusChip = (
    <PermissionsGate
      authorizedPermissions={[PERMISSIONS.canChangeScenarioValidationStatus]}
      RenderNoPermissionComponent={ScenarioValidationStatusChip}
      noPermissionProps={{
        status: currentScenarioValidationStatus,
        labels: scenarioValidationStatusLabels,
        onDelete: null,
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
    <>
      <Backdrop className={classes.backdrop} open={showBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid data-cy="scenario-view" container direction="column" className={classes.mainGrid}>
        <Grid item xs={12}>
          <Grid container alignItems="center" className={classes.mainGrid}>
            <Grid item xs={9}>
              <Grid container spacing={0} alignItems="center" className={classes.mainGrid}>
                <Grid item xs={5} className={classes.scenarioList}>
                  <HierarchicalComboBox
                    value={currentScenario.data}
                    values={sortedScenarioList}
                    labels={hierarchicalComboBoxLabels}
                    handleChange={handleScenarioChange}
                    disabled={scenarioListDisabled}
                    renderInputToolType={currentScenarioRenderInputTooltip}
                  />
                </Grid>
                {currentScenario.data && (
                  <Grid item xs={7} className={classes.scenarioMetadata}>
                    {scenarioValidationArea}
                    <Typography className={classes.scenarioRunTemplateLabel}>
                      {t('views.scenario.text.scenariotype')}: {currentScenario.data.runTemplateName}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Grid container spacing={0} justifyContent="flex-end" className={classes.mainGrid}>
                <Grid item>
                  <PermissionsGate authorizedPermissions={[PERMISSIONS.canCreateScenario]}>
                    <CreateScenarioButton
                      solution={solution}
                      workspaceId={workspaceId}
                      createScenario={expandParametersAndCreateScenario}
                      currentScenario={currentScenario}
                      runTemplates={filteredRunTemplates}
                      datasets={datasetList.data}
                      scenarios={scenarioList.data}
                      user={user}
                      disabled={editMode}
                      nameValidator={NAME_VALIDATOR}
                      labels={createScenarioDialogLabels}
                    />
                  </PermissionsGate>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {currentScenario.data && (
              <ScenarioParameters
                editMode={editMode}
                changeEditMode={setEditMode}
                addDatasetToStore={addDatasetToStore}
                updateAndLaunchScenario={updateAndLaunchScenario}
                launchScenario={launchScenario}
                accordionSummaryExpanded={accordionSummaryExpanded}
                onChangeAccordionSummaryExpanded={setAccordionSummaryExpanded}
                workspaceId={workspaceId}
                solution={solution.data}
                datasets={datasetList.data}
                currentScenario={currentScenario}
                scenarioId={currentScenario.data.id}
                scenarioList={scenarioList.data}
                userRoles={user.roles}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
      <Card>
        <SimplePowerBIReportEmbed
          reports={reports}
          reportConfiguration={SCENARIO_DASHBOARD_CONFIG}
          scenario={currentScenario.data}
          lang={i18n.language}
          downloadLogsFile={() => {
            ScenarioRunService.downloadLogsFile(currentScenario.data?.lastRun, LOG_TYPES[SCENARIO_RUN_LOG_TYPE]);
          }}
          labels={reportLabels}
          useAAD={USE_POWER_BI_WITH_USER_CREDENTIALS}
          iframeRatio={SCENARIO_VIEW_IFRAME_DISPLAY_RATIO}
        />
      </Card>
    </>
  );
};

Scenario.propTypes = {
  setScenarioValidationStatus: PropTypes.func.isRequired,
  setCurrentScenario: PropTypes.func.isRequired,
  scenarioList: PropTypes.object.isRequired,
  datasetList: PropTypes.object.isRequired,
  currentScenario: PropTypes.object.isRequired,
  findScenarioById: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  workspace: PropTypes.object.isRequired,
  solution: PropTypes.object.isRequired,
  addDatasetToStore: PropTypes.func.isRequired,
  createScenario: PropTypes.func.isRequired,
  updateAndLaunchScenario: PropTypes.func.isRequired,
  launchScenario: PropTypes.func.isRequired,
  reports: PropTypes.object.isRequired,
  catchNonCriticalErrors: PropTypes.func,
};

export default Scenario;
