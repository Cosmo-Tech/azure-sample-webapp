// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useState, useMemo } from 'react';
import {
  Backdrop,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { ScenarioParameters, SimplePowerBIReportEmbedWrapper } from '../../components';
import { useTranslation } from 'react-i18next';
import {
  CreateScenarioButton,
  HierarchicalComboBox,
  ScenarioValidationStatusChip,
  PermissionsGate,
  RolesEditionButton,
} from '@cosmotech/ui';
import { sortScenarioList } from '../../utils/SortScenarioListUtils';
import { SCENARIO_VALIDATION_STATUS } from '../../services/config/ApiConstants.js';
import ScenarioService from '../../services/scenario/ScenarioService';
import { STATUSES } from '../../state/commons/Constants';
import { AppInsights } from '../../services/AppInsights';
import { ACL_PERMISSIONS } from '../../services/config/accessControl';
import {
  getCreateScenarioDialogLabels,
  getShareScenarioDialogLabels,
  getPermissionsLabels,
  getRolesLabels,
} from './labels';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
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

const Scenario = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [
    scenarioList,
    datasetList,
    currentScenario,
    user,
    workspace,
    userPermissionsOnCurrentWorkspace,
    solution,
    roles,
    permissions,
    permissionsMapping,
    addDatasetToStore,
    applyScenarioSharingSecurity,
    setScenarioValidationStatus,
    findScenarioById,
    createScenario,
    updateAndLaunchScenario,
    launchScenario,
    setApplicationErrorMessage,
  ] = useScenario();

  const routerParameters = useParams();
  const workspaceId = workspace.data.id;
  const workspaceUsers = workspace.data.users.map((user) => ({ id: user }));
  const [editMode, setEditMode] = useState(false);

  const createScenarioDialogLabels = getCreateScenarioDialogLabels(t, editMode);
  const shareScenarioDialogLabels = getShareScenarioDialogLabels(t, currentScenario?.data?.name);

  // Add accordion expand status in state
  const [accordionSummaryExpanded, setAccordionSummaryExpanded] = useState(
    localStorage.getItem('scenarioParametersAccordionExpanded') === 'true'
  );

  const handleScenarioChange = (event, scenario) => {
    findScenarioById(workspaceId, scenario.id);
  };

  useEffect(() => {
    localStorage.setItem('scenarioParametersAccordionExpanded', accordionSummaryExpanded);
  }, [accordionSummaryExpanded]);

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

  useEffect(() => {
    appInsights.setScenarioData(currentScenario.data);
  }, [currentScenario]);

  const sortedScenarioList = sortScenarioList(scenarioList.data.slice());
  const noScenario = currentScenario.data === null;
  const scenarioListDisabled = editMode || scenarioList === null || noScenario;
  const scenarioListLabel = noScenario ? null : t('views.scenario.dropdown.scenario.label', 'Scenario');
  const showBackdrop = currentScenario.status === STATUSES.LOADING;
  useRedirectionToScenario(sortedScenarioList);
  // this function enables backwards navigation between scenario's URLs
  window.onpopstate = (e) => {
    const scenarioFromUrl = scenarioList.data.find((el) => el.id === routerParameters.scenarioId);
    if (scenarioFromUrl) handleScenarioChange(event, scenarioFromUrl);
  };
  const getFilteredRunTemplates = (solution, workspace) => {
    let filteredRunTemplates = solution?.data?.runTemplates || [];
    const solutionRunTemplates = workspace.data?.solution?.runTemplateFilter;
    if (solutionRunTemplates) {
      filteredRunTemplates = filteredRunTemplates.filter(
        (runTemplate) => solutionRunTemplates.indexOf(runTemplate.id) !== -1
      );
    }
    return filteredRunTemplates;
  };
  const filteredRunTemplates = useMemo(() => getFilteredRunTemplates(solution, workspace), [solution, workspace]);

  const resetScenarioValidationStatus = async () => {
    const currentStatus = currentScenario.data.validationStatus;
    try {
      setScenarioValidationStatus(currentScenario.data.id, SCENARIO_VALIDATION_STATUS.LOADING);
      await ScenarioService.resetValidationStatus(workspaceId, currentScenario.data.id);
      findScenarioById(workspaceId, currentScenario.data.id);
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
      await ScenarioService.setScenarioValidationStatusToValidated(workspaceId, currentScenario.data.id);
      findScenarioById(workspaceId, currentScenario.data.id);
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
      await ScenarioService.setScenarioValidationStatusToRejected(workspaceId, currentScenario.data.id);
      findScenarioById(workspaceId, currentScenario.data.id);
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

  const createScenarioButton = (
    <PermissionsGate
      userPermissions={userPermissionsOnCurrentWorkspace}
      necessaryPermissions={[ACL_PERMISSIONS.WORKSPACE.CREATE_CHILDREN]}
      noPermissionProps={{
        disabled: true, // Prevent scenario creation if user has insufficient privileges
      }}
    >
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
        labels={createScenarioDialogLabels}
      />
    </PermissionsGate>
  );

  const applyScenarioSecurityChanges = (newScenarioSecurity) => {
    applyScenarioSharingSecurity(currentScenario.data.id, newScenarioSecurity);
  };

  const accessListSpecific = currentScenario?.data?.security?.accessControlList;
  const defaultRole = currentScenario?.data?.security?.default;

  const rolesNames = Object.values(roles.scenario);
  const rolesLabels = getRolesLabels(t, rolesNames);
  const permissionsNames = Object.values(permissions.scenario);
  const permissionsLabels = getPermissionsLabels(t, permissionsNames);

  const shareScenarioButton = (
    <>
      <PermissionsGate
        userPermissions={userPermissionsOnCurrentScenario}
        necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.READ_SECURITY]}
      >
        <PermissionsGate
          userPermissions={userPermissionsOnCurrentScenario}
          necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.WRITE_SECURITY]}
          noPermissionProps={{ isReadOnly: true }}
        >
          <RolesEditionButton
            data-cy="share-scenario-button"
            labels={shareScenarioDialogLabels}
            onConfirmChanges={(newScenarioSecurity) => {
              applyScenarioSecurityChanges(newScenarioSecurity);
            }}
            resourceRolesPermissionsMapping={permissionsMapping.scenario}
            agents={workspaceUsers}
            specificAccessByAgent={accessListSpecific ?? []}
            defaultRole={defaultRole || ''}
            defaultAccessScope="Workspace"
            preventNoneRoleForAgents={true}
            allRoles={rolesLabels}
            allPermissions={permissionsLabels}
          />
        </PermissionsGate>
      </PermissionsGate>
    </>
  );

  return (
    <>
      <Backdrop open={showBackdrop} style={{ zIndex: '10000' }}>
        <CircularProgress data-cy="scenario-loading-spinner" color="inherit" />
      </Backdrop>
      <div data-cy="scenario-view" className={classes.content}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <div>
              <Grid container spacing={1} alignItems="center" justifyContent="flex-start">
                <Grid item>{createScenarioButton}</Grid>
                <Grid item>{shareScenarioButton}</Grid>
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
            <Card component={Paper} elevation={2}>
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
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card component={Paper} elevation={2}>
              <CardContent>
                <SimplePowerBIReportEmbedWrapper />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Scenario;
