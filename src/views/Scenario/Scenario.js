// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState, useEffect } from 'react';
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

const appInsights = AppInsights.getInstance();

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

  useEffect(() => {
    appInsights.setScenarioData(currentScenario.data);
  }, [currentScenario]);

  const sortedScenarioList = sortScenarioList(scenarioList.data.slice());
  const noScenario = currentScenario.data === null;
  const scenarioListDisabled = editMode || scenarioList === null || noScenario;
  const scenarioListLabel = noScenario
    ? null
    : t('views.scenario.dropdown.scenario.label', Scenario);
  const showBackdrop = currentScenario.status === STATUSES.LOADING;

  const createScenarioDialogLabels = {
    button: {
      title: t('commoncomponents.button.create.scenario.label', 'Create Alternative Scenario'),
      tooltip: createScenarioButtonToolType
    },
    dialog: {
      title: t('commoncomponents.dialog.create.scenario.text.title', 'Create alternative scenario'),
      scenarioName: t('commoncomponents.dialog.create.scenario.input.scenarioname.label'),
      scenarioMaster: t('commoncomponents.dialog.create.scenario.checkbox.scenarioMaster.label',
        'Master'),
      scenarioParent: t('commoncomponents.dialog.create.scenario.dropdown.parentscenario.label',
        'Parent scenario'),
      datasetPlaceholder: t('commoncomponents.dialog.create.scenario.dropdown.dataset.placeholder',
        'Dataset'),
      dataset: t('commoncomponents.dialog.create.scenario.dropdown.dataset.label',
        'Select a dataset'),
      scenarioTypePlaceholder:
              t('commoncomponents.dialog.create.scenario.dropdown.scenariotype.placeholder', 'Scenario'),
      scenarioType: t('commoncomponents.dialog.create.scenario.dropdown.scenariotype.label',
        'Scenario Type'),
      cancel: t('commoncomponents.dialog.create.scenario.button.cancel', 'Cancel'),
      create: t('commoncomponents.dialog.create.scenario.button.create', 'Create')
    },
    errors: {
      emptyScenarioName: t('commoncomponents.dialog.create.scenario.input.scenarioname.error.empty'),
      existingScenarioName: t('commoncomponents.dialog.create.scenario.input.scenarioname.error.existing'),
      forbiddenCharsInScenarioName: t('commoncomponents.dialog.create.scenario.input.scenarioname.error.forbiddenchars')
    }
  };

  const reportLabels = {
    noScenario: {
      title: t('commoncomponents.iframe.scenario.noscenario.title', 'No scenario yet'),
      label: t('commoncomponents.iframe.scenario.noscenario.label',
        'You can create a scenario by clicking on Create Alternative Scenario')
    },
    noRun: {
      label: t('commoncomponents.iframe.scenario.results.label.uninitialized',
        'The scenario has not been run yet')
    },
    inProgress: {
      label: t('commoncomponents.iframe.scenario.results.label.running', 'Scenario run in progress...')
    },
    hasErrors: {
      label: t('commoncomponents.iframe.scenario.results.text.error',
        'An error occured during the scenario run')
    },
    downloadButton: t('commoncomponents.iframe.scenario.results.button.downloadLogs', 'Download logs'),
    refreshButton: t('commoncomponents.iframe.scenario.results.button.refresh', 'Refresh'),
    errors: {
      unknown: t('commoncomponents.iframe.scenario.error.unknown.label', 'Unknown error'),
      details: t('commoncomponents.iframe.scenario.error.unknown.details',
        'Something went wrong when fetching PowerBI reports info')
    }
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
                    createScenario={createScenario}
                    currentScenario={currentScenario}
                    runTemplates={runTemplateList.data}
                    datasets={datasetList.data}
                    scenarios={scenarioList.data}
                    user={user}
                    disabled={editMode}
                    nameValidator={NAME_VALIDATOR}
                    labels={createScenarioDialogLabels}
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
                }}
            labels={reportLabels}/>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            { currentScenario.data &&
            <ScenarioParameters
                editMode={editMode}
                changeEditMode={setEditMode}
                updateAndLaunchScenario={updateAndLaunchScenario}
                launchScenario={launchScenario}
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
