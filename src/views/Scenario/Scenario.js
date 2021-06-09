// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Card, makeStyles } from '@material-ui/core';
import HierarchicalComboBox from '../../components/HierarchicalComboBox';
import { ScenarioParameters } from '../../components';
import { useTranslation } from 'react-i18next';
import { CreateScenarioButton } from '../../components/CreateScenarioDialog';
import { Dashboard } from '@cosmotech/ui';
import { SCENARIO_DASHBOARD_CONFIG } from '../../configs/ScenarioDashboard.config';

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
  const { t } = useTranslation();

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
    launchScenario
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
                  values={scenarioList.data}
                  label={t('views.scenario.dropdown.scenario.label', Scenario)}
                  handleChange={handleScenarioChange}
                  disabled={editMode}
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
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Card style={{ height: '400px' }}>
          { currentScenario.data &&
            <Dashboard
              iframeTitle={t('commoncomponents.iframe.scenario.results.card.title', 'Results')}
              url={SCENARIO_DASHBOARD_CONFIG.url}
              scenarioName={currentScenario.data.name}
              scenarioState={currentScenario.data.state}
              csmSimulationRun={currentScenario.data.lastRun?.csmSimulationRun}
            />
          }
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
  launchScenario: PropTypes.func.isRequired
};

export default Scenario;
