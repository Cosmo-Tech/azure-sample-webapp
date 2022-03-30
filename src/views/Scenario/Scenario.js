// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Backdrop, Card, CircularProgress, Grid, Typography } from '@material-ui/core';
import { ScenarioParameters } from '../../components';
import { useTranslation } from 'react-i18next';
import { CreateScenarioButton, HierarchicalComboBox, SimplePowerBIReportEmbed } from '@cosmotech/ui';
import { NAME_VALIDATOR } from '../../utils/ValidationUtils';
import { sortScenarioList } from '../../utils/SortScenarioListUtils';
import { LOG_TYPES } from '../../services/scenarioRun/ScenarioRunConstants.js';
import { SCENARIO_RUN_LOG_TYPE, USE_POWER_BI_WITH_USER_CREDENTIALS } from '../../config/AppConfiguration';
import { SCENARIO_DASHBOARD_CONFIG } from '../../config/Dashboards';
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
                    label={scenarioListLabel}
                    handleChange={handleScenarioChange}
                    disabled={scenarioListDisabled}
                    renderInputToolType={currentScenarioRenderInputTooltip}
                  />
                </Grid>
                {currentScenario.data && (
                  <Grid item xs={7}>
                    <Typography>
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
      <Grid>
        <Card className={classes.powerBICard}>
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
          />
        </Card>
      </Grid>
    </>
  );
};

Scenario.propTypes = {
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
};

export default Scenario;
