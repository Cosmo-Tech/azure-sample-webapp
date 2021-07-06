// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Card, makeStyles } from '@material-ui/core';
import { ScenarioParameters } from '../../components';
import { useTranslation } from 'react-i18next';
import {
  CreateScenarioButton,
  HierarchicalComboBox,
  SimplePowerBIReportEmbed
} from '@cosmotech/ui';
import { NAME_VALIDATOR } from '../../utils/ValidationUtils';
import { sortScenarioList } from '../../utils/SortScenarioListUtils';
import { SCENARIO_DASHBOARD_CONFIG, SCENARIO_RUN_LOG_TYPE } from '../../configs/App.config';
import ScenarioRunService from '../../services/scenarioRun/ScenarioRunService';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
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
    paddingBottom: '6px'
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
    // eslint-disable-next-line no-unused-vars
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

  return (
      <Grid container direction="column" className={classes.mainGrid}>
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
                  <Typography>{ t('views.scenario.text.scenariotype')}: { currentScenario.data.runTemplateName}</Typography>
                </Grid>)
                }
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Grid container spacing={0} justify="flex-end" className={classes.mainGrid}>
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
            {/* TODO Placeholder when error or not scenario */}
            <SimplePowerBIReportEmbed
                reports={reports}
                reportConfiguration={SCENARIO_DASHBOARD_CONFIG}
                scenario={currentScenario.data}
                lang={i18n.language}
                downloadLogsFile={() => {
                  ScenarioRunService.downloadLogsFile(
                    currentScenario.data?.lastRun,
                    SCENARIO_RUN_LOG_TYPE);
                }}/>
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
