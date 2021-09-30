// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Backdrop,
  Card,
  CircularProgress,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import { ScenarioParameters } from '../../components';
import { useTranslation } from 'react-i18next';
import {
  CreateScenarioButton,
  HierarchicalComboBox,
  SimplePowerBIReportEmbed
} from '@cosmotech/ui';
import { NAME_VALIDATOR } from '../../utils/ValidationUtils';
import { sortScenarioList } from '../../utils/SortScenarioListUtils';
import { LOG_TYPES } from '../../services/scenarioRun/ScenarioRunConstants.js';
import { SCENARIO_RUN_LOG_TYPE } from '../../config/AppConfiguration';
import { SCENARIO_DASHBOARD_CONFIG } from '../../config/Dashboards';
import ScenarioRunService from '../../services/scenarioRun/ScenarioRunService';
import { STATUSES } from '../../state/commons/Constants';
import { AppInsights } from '../../services/AppInsights';
import { ENABLE_APPLICATION_INSIGHTS } from '../../config/AppInstance';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  scenarioPanel: {
    height: '100%',
    flexGrow: 1,
    paddingRight: '4px',
    display: 'flex',
    flexDirection: 'column',
    margin: '4px'
  },
  scenarioList: {
    paddingRight: '20px'
  },
  mainGrid: {
    display: 'flex',
    flexGrow: 1,
    paddingLeft: '2px',
    paddingTop: '6px',
    paddingRight: '2px',
    paddingBottom: '6px',
    backgroundColor: theme.palette.background.paper
  },
  grid: {
    flexGrow: 1,
    height: '100%'
  }
}));

const Scenario = (props) => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  const {
    currentScenario,
    scenarioList,
    findScenarioById,
    datasetList,
    runTemplateList,
    user,
    workspace,
    solution,
    createScenario,
    updateAndLaunchScenario,
    launchScenario,
    reports
  } = props;

  const workspaceId = workspace.data.id;
  const [editMode, setEditMode] = useState(false);

  const currentScenarioRenderInputToolType = editMode
    ? t('views.scenario.dropdown.scenario.tooltip.disabled',
      'Please save or discard current modifications before selecting another scenario')
    : '';
  const createScenarioButtonToolType = editMode
    ? t('commoncomponents.button.create.scenario.tooltip.disabled',
      'Please save or discard current modifications before creating a new scenario')
    : '';

  const handleScenarioChange = (event, scenario) => {
    findScenarioById(workspaceId, scenario.id);
  };

  const sortedScenarioList = sortScenarioList(scenarioList.data.slice());
  const noScenario = currentScenario.data === null;
  const scenarioListDisabled = editMode || scenarioList === null || noScenario;
  const scenarioListLabel = noScenario
    ? null
    : t('views.scenario.dropdown.scenario.label', Scenario);
  const showBackdrop = currentScenario.status === STATUSES.LOADING;

  // App Insigths
  const appInsights =
    ENABLE_APPLICATION_INSIGHTS
      ? AppInsights.getInstance()
      : undefined;

  // Track create scenario
  const trackCreateScenario = () => {
    appInsights.trackEvent({ name: 'CreateScenario' }, { name: currentScenario.rootId });
    appInsights.trackMetric({ name: 'CreateScenarioValue', average: 1, sampleCount: 1 });
  };

  const createTrackedScenario = (workspaceId, scenario) => {
    if (appInsights) {
      trackCreateScenario();
    }
    createScenario(workspaceId, scenario);
  };

  // Track launch scenario
  const trackLaunchScenario = () => {
    appInsights.trackEvent({ name: 'LaunchScenario' }, { scenarioId: currentScenario.rootId });
    appInsights.trackMetric({ name: 'LaunchScenarioValue', average: 1, sampleCount: 1 });
  };

  const updateAndLaunchTrackedScenario = (workspaceId, scenarioId, scenarioParameters) => {
    if (appInsights) {
      trackLaunchScenario();
    }
    updateAndLaunchScenario(workspaceId, scenarioId, scenarioParameters);
  };

  const launchTrackedScenario = (workspaceId, scenarioId) => {
    if (appInsights) {
      trackLaunchScenario();
    }
    launchScenario(workspaceId, scenarioId);
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
                    maxCharLength={36}
                    values={sortedScenarioList}
                    label={scenarioListLabel}
                    handleChange={handleScenarioChange}
                    disabled={scenarioListDisabled}
                    renderInputToolType={currentScenarioRenderInputToolType}
                  />
                </Grid>
                { currentScenario.data &&
                (<Grid item xs={7}>
                  <Typography>
                    { t('views.scenario.text.scenariotype')}: { currentScenario.data.runTemplateName}</Typography>
                </Grid>)
                }
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Grid container spacing={0} justifyContent="flex-end" className={classes.mainGrid}>
                <Grid item>
                  <CreateScenarioButton
                    solution={solution}
                    workspaceId={workspaceId}
                    createScenario={createTrackedScenario}
                    currentScenario={currentScenario}
                    runTemplates={runTemplateList.data}
                    datasets={datasetList.data}
                    scenarios={scenarioList.data}
                    user={user}
                    disabled={editMode}
                    buttonTooltip={createScenarioButtonToolType}
                    nameValidator={NAME_VALIDATOR}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Card style={{ height: '400px' }}>
            <SimplePowerBIReportEmbed
                reports={reports}
                reportConfiguration={SCENARIO_DASHBOARD_CONFIG}
                scenario={currentScenario.data}
                lang={i18n.language}
                downloadLogsFile={() => {
                  ScenarioRunService.downloadLogsFile(
                    currentScenario.data?.lastRun,
                    LOG_TYPES[SCENARIO_RUN_LOG_TYPE]);
                }}/>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            { currentScenario.data &&
            <ScenarioParameters
                editMode={editMode}
                changeEditMode={setEditMode}
                updateAndLaunchScenario={updateAndLaunchTrackedScenario}
                launchScenario={launchTrackedScenario}
                workspaceId={workspaceId}
                currentScenario={currentScenario}
                scenarioId={currentScenario.data.id}/>
            }
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

Scenario.propTypes = {
  scenarioList: PropTypes.object.isRequired,
  datasetList: PropTypes.object.isRequired,
  runTemplateList: PropTypes.object.isRequired,
  currentScenario: PropTypes.object.isRequired,
  findScenarioById: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  workspace: PropTypes.object.isRequired,
  solution: PropTypes.object.isRequired,
  createScenario: PropTypes.func.isRequired,
  updateAndLaunchScenario: PropTypes.func.isRequired,
  launchScenario: PropTypes.func.isRequired,
  reports: PropTypes.object.isRequired
};

export default Scenario;
