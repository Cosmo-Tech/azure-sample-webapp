// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
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
import {
  APP_PERMISSIONS,
  ACL_PERMISSIONS,
  PERMISSIONS_BY_ACL_ROLE,
  ACL_ROLES,
} from '../../services/config/accessControl';
import {
  getCreateScenarioDialogLabels,
  getShareScenarioDialogLabels,
  getPermissionsLabels,
  getRolesLabels,
} from './labels';
import { useNavigate, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useScenario } from './ScenarioHook';

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
    solution,
    addDatasetToStore,
    setScenarioSecurity,
    setScenarioValidationStatus,
    findScenarioById,
    createScenario,
    updateCurrentScenario,
    updateAndLaunchScenario,
    launchScenario,
    setApplicationErrorMessage,
  ] = useScenario();

  const routerParameters = useParams();
  const navigate = useNavigate();
  const workspaceId = workspace.data.id;
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

  useEffect(() => {
    if (sortedScenarioList.length !== 0) {
      if (routerParameters.id === undefined) {
        navigate(`/scenario/${currentScenario.data.id}`);
      } else if (currentScenario.data.id !== routerParameters.id) {
        const scenarioFromUrl = { id: routerParameters.id };
        handleScenarioChange(event, scenarioFromUrl);
        navigate(`/scenario/${scenarioFromUrl.id}`);
      }
    } else {
      navigate('/scenario');
    }
    // eslint-disable-next-line
  }, []);

  // this function enables backwards navigation between scenario's URLs
  window.onpopstate = (e) => {
    const scenarioFromUrl = scenarioList.data.find((el) => el.id === routerParameters.id);
    if (scenarioFromUrl) handleScenarioChange(event, scenarioFromUrl);
  };

  useEffect(() => {
    if (sortedScenarioList.length > 0) {
      if (currentScenario.data === null) {
        handleScenarioChange(event, sortedScenarioList[0]);
        navigate(`/scenario/${sortedScenarioList[0].id}`);
      } else if (currentScenario.data.id !== routerParameters.id) {
        navigate(`/scenario/${currentScenario.data.id}`);
        updateCurrentScenario({ status: STATUSES.SUCCESS });
      }
    }
    // eslint-disable-next-line
  }, [currentScenario]);

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
  // const userPermissionsOnCurrentScenario = currentScenario?.security?.currentUserPermissions || [];
  const userAppPermissions = useSelector((state) => state.auth.permissions);
  const userEmail = useSelector((state) => state.auth.userEmail);
  const userId = useSelector((state) => state.auth.userId);
  const userAppAndScenarioPermissions = userAppPermissions.concat(userPermissionsOnCurrentScenario);
  const validationStatusButtons = (
    <PermissionsGate
      userPermissions={userAppAndScenarioPermissions}
      necessaryPermissions={[
        ACL_PERMISSIONS.SCENARIO.EDIT_VALIDATION_STATUS,
        APP_PERMISSIONS.SCENARIO.EDIT_VALIDATION_STATUS,
      ]}
      sufficientPermissions={[APP_PERMISSIONS.ADMIN]}
    >
      {validateButtonTooltipWrapper}
      {rejectButtonTooltipWrapper}
    </PermissionsGate>
  );

  const scenarioValidationStatusChip = (
    <PermissionsGate
      userPermissions={userAppAndScenarioPermissions}
      necessaryPermissions={[
        ACL_PERMISSIONS.SCENARIO.EDIT_VALIDATION_STATUS,
        APP_PERMISSIONS.SCENARIO.EDIT_VALIDATION_STATUS,
      ]}
      sufficientPermissions={[APP_PERMISSIONS.ADMIN]}
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
      userPermissions={userAppPermissions}
      necessaryPermissions={[APP_PERMISSIONS.SCENARIO.CREATE]}
      sufficientPermissions={[APP_PERMISSIONS.ADMIN]}
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
    // TODO: compute diff & call API
    setScenarioSecurity(currentScenario.data.id, newScenarioSecurity, userEmail, userId);
  };

  const FAKE_USERS_LIST = [
    { id: 'alice@somecompany.com' },
    { id: 'bob@somecompany.com' },
    { id: 'tristan.huet@cosmotech.com' },
    { id: 'elena.sasova@cosmotech.com' },
  ];
  const accessListSpecific = currentScenario?.data?.security?.accessControlList.map((agent) => ({
    id: agent.id,
    roles: agent.roles[0],
  }));
  const defaultAccessList = currentScenario?.data?.security?.default[0];

  const rolesNames = Object.values(ACL_ROLES.SCENARIO);
  const rolesLabels = getRolesLabels(t, rolesNames);
  const permissionsNames = Object.values(ACL_PERMISSIONS.SCENARIO);
  const permissionsLabels = getPermissionsLabels(t, permissionsNames);

  const shareScenarioButton = (
    <PermissionsGate
      userPermissions={userAppAndScenarioPermissions}
      necessaryPermissions={[APP_PERMISSIONS.SCENARIO.VIEW_PERMISSIONS]}
      sufficientPermissions={[APP_PERMISSIONS.ADMIN]}
    >
      <PermissionsGate
        userPermissions={userAppAndScenarioPermissions}
        necessaryPermissions={[APP_PERMISSIONS.SCENARIO.EDIT_PERMISSIONS]}
        sufficientPermissions={[APP_PERMISSIONS.ADMIN]}
        noPermissionProps={{ isReadOnly: true }}
      >
        <Button
          size="medium"
          variant="outlined"
          color="primary"
          onClick={() => {
            applyScenarioSecurityChanges({
              ...currentScenario.data.security,
              // default: ['commonroleadmin'],
              default: 'commonroleadmin',
              accessControlList: [],
            });
          }}
        >
          🚀 Escalate to admin 🚀
        </Button>
        <RolesEditionButton
          data-cy="share-scenario-button"
          labels={shareScenarioDialogLabels}
          // scenarioId={currentScenario?.data?.id}
          onConfirmChanges={(updateScenarioAgentsList) => {
            applyScenarioSecurityChanges(updateScenarioAgentsList);
            console.log(updateScenarioAgentsList);
          }}
          // resourceRolesPermissionsMapping={permissionsByRoles}
          resourceRolesPermissionsMapping={PERMISSIONS_BY_ACL_ROLE}
          agents={FAKE_USERS_LIST}
          specificAccessByAgent={accessListSpecific}
          defaultAccess={defaultAccessList}
          defaultAccessScope="Workspace"
          allRoles={rolesLabels}
          allPermissions={permissionsLabels}
          resourceId={currentScenario?.data?.id}
        />
      </PermissionsGate>
    </PermissionsGate>
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
                <Typography variant="caption" align="center" className={classes.runTemplate}>
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
